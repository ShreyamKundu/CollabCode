import React from 'react';
import 'tailwindcss/tailwind.css';
import EDtor from '../../Components/EDtor';
import { EditorNav } from '../../Components';
import { useRef,useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import { initializeSocket } from '../../socket';
import { axiosInstance } from '../../../utils';
import { useDispatch,useSelector } from 'react-redux';
import { setTeam } from '../../../features/meetingSlice';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { setSelectedTeam,setMeetingId,setMeetingName } from '../../../features/meetingSlice';
import { toast } from 'react-toastify';

const Editor = () => {
  const socketRef = useRef(null);
  const user =  auth.currentUser;
  const { meetingId } = useParams();
  const [value, setValue] = useState('');
  const selectedTeam = useSelector(state => state.meeting.selectedTeam);
  const username = useSelector(state => state.user.username) || user?.displayName;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = user?.uid;
  let isUserPresent = true;
  const [language, setLanguage] = useState('python');

  const reloadWorkspace = async () =>{
    try {
      const response = await axiosInstance.post('/api/v1/project/showTeam',{roomId:meetingId});
      const {team,_id,name} = response.data.workspace;
      isUserPresent = team.some(member => member.id === userId);
      const teamType =response.data.workspace.type ;
      if (teamType !== 'solo' && !isUserPresent) {
        console.log('user not present');
        navigate('/dashboard/newproject');
        return;
    }
      dispatch(setTeam(team));
      dispatch(setMeetingId(_id));
      dispatch(setMeetingName(name));
      dispatch(setSelectedTeam(teamType));
      console.log(teamType);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    reloadWorkspace();
  },[]);

  useEffect(() => {
    const initSocket = async () => {
        if (!socketRef.current) {
            socketRef.current = await initializeSocket();
            socketRef.current.emit('joinRoom',{roomId:meetingId,username});
            socketRef.current.on('userJoined', async ({username, roomId}) => {
                console.log(`${username} joined`);
                toast.success(`${username} joined the meeting`);
                console.log('Room joined: ', roomId);
                try {
                  const response = await axiosInstance.post('/api/v1/project/showTeam',{roomId});
                  const {team} = response.data.workspace;
                  dispatch(setTeam(team));
                } catch (error) {
                  console.log(error);
                }
            });

            socketRef.current.on('code-sync', (code) => {
                setValue(code);
            });

            socketRef.current.on('tab-change',(lang)=>{
              setLanguage(lang);
              // console.log(lang);
            })


            socketRef.current.on('user-removed', () => {
              reloadWorkspace();
            })

            socketRef.current.on('user-left', ({ userId, username, meetingId,updatedWorkspace }) => {
                // console.log(`${username} has left the room.`); 
                toast.info(`${username} left the meeting`);
                console.log("after disconnect",updatedWorkspace.team);
                dispatch(setTeam(updatedWorkspace.team));
          });
            
            // socketRef.current.on('disconnect', async () => {
            // })
        }
    };

    initSocket();

    // Proper cleanup to remove listeners
    return () => {
        if (socketRef.current) {
          socketRef.current.emit('userDisconnect', { userId, username, meetingId });
            socketRef.current.off('userJoined');
            socketRef.current.off('code-sync');
            socketRef.current.off('tab-change');
            socketRef.current.disconnect();
        }
    };
}, [meetingId]);

  return (
    (isUserPresent || selectedTeam==='solo') && (<section className=' max-h-screen md:overflow-hidden overflow-y-auto overflow-x-hidden w-full'>
      <EditorNav socketRef={socketRef}/>
      <EDtor socketRef={socketRef} value={value} setValue={setValue} language={language} setLanguage={setLanguage}/>
    </section>)
  );
}

export default Editor;