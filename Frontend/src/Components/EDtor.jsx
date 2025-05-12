import React, { useEffect, useRef, useState } from 'react';
import { Editor } from "@monaco-editor/react";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CODE_SNIPPETS } from '../constants';
import { executeCode } from '../api';
import { initializeSocket } from '../socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../utils/index';
import { useSelector } from 'react-redux';
import { selectHostId, selectMeetingId, selectMeetingName } from '../../features/meetingSlice';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { setTeam, setMeetingId, setMeetingName } from '../../features/meetingSlice';
import { useFirebase } from '../Context/FirebaseContext';
let isUserPresent = true;

const EditorComponent = ({ socketRef, value, setValue, language, setLanguage }) => {
    const [theme, setTheme] = useState('vs-dark');
    const editorRef = useRef(null);
    const selectedTeam = useSelector(state => state.meeting.selectedTeam);
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [teamType, setTeamType] = useState('');
    const { meetingId } = useParams();
    const meetId = useSelector(selectMeetingId);
    const meetName = useSelector(selectMeetingName);
    const hostId = useSelector(selectHostId);
    const [copied, setCopied] = useState(false);
    const dispatch = useDispatch();
    const { user } = useFirebase();
    const userId = user?.uid;
    const username = useSelector(state => state.user.username) || user?.displayName;
    const navigate = useNavigate();
    const isHost = ((userId === hostId) || selectedTeam === 'solo');
    const teamMembers = useSelector(state => state.meeting.team);
    const [host, setHost] = useState('');
    const [showMenu, setShowMenu] = useState(false);


    const showTeamMembers = async () => {
        const response = await axiosInstance.post('/api/v1/project/showTeam', { roomId: meetingId });
        const { team, _id, name } = response.data.workspace;
        isUserPresent = team.some(member => member.id === userId);
        const type = response.data.workspace.type;
        setHost(response.data.workspace.host.id);
        setTeamType(type);
        if (!isUserPresent && type !== 'solo') {
            navigate('/dashboard/newproject');
            return;
        }
        dispatch(setTeam(team));
        dispatch(setMeetingId(_id));
        dispatch(setMeetingName(name));

    }

    useEffect(() => {
        showTeamMembers();
    }, [teamMembers]);

    const setCode = async () => {
        const r2 = await axiosInstance.post('/api/v1/project/showTeam', { roomId: meetingId });
        setValue(r2.data.workspace.code[language]);
    }

    useEffect(() => {
        setCode();
    }, []);

    useEffect(() => {
        setCode();
    }, [language]);


    const removeTeamMembers = async (memberId) => {
        try {
            socketRef?.current?.emit('remove-user', { memberId, meetingId });
            const response = await axiosInstance.post('/api/v1/project/remove', { meetingId, userId: memberId });
        } catch (error) {
            console.log("Error removing team members", error);
        }
    };


    const handleCodeChange = (newValue) => {
        setValue(newValue);
        if (socketRef.current) {
            socketRef.current.emit('code-change', { value: newValue, meetingId });
        }
    };


    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const toggleTheme = () => {
        setTheme((prevTheme) => prevTheme === 'vs-dark' ? 'vs-white' : 'vs-dark');
    };

    const onSelectLanguage = async (newLanguage) => {
        setLanguage(newLanguage);

        if (socketRef.current) {
            socketRef.current.emit('language-change', { lang: newLanguage, meetingId });
        }

        const response = await axiosInstance.post('/api/v1/project/language', {
            meetingId,
            language: newLanguage
        });
        setValue(response.data.workspace.code[newLanguage]);
    };

    const codeSave = async () => {
        const response = await axiosInstance.post('/api/v1/project/save', {
            meetingId,
            code: value
        })

    };

    const runCode = async () => {
        const sourcecode = editorRef.current.getValue();
        if (!sourcecode) return;
        const r2 = await axiosInstance.post('/api/v1/project/save', {
            meetingId,
            code: sourcecode
        })

        setIsError(false);
        try {
            setIsLoading(true);
            const response = await axiosInstance.post('/api/v1/project/run', {
                code: sourcecode,
                input: '2',
                language: language
            });
            const output = response.data;
            setOutput(output);
            console.log(output);

        } catch (error) {
            if (language == 'python') {
                setOutput('An error occurred\n' + error.response.data.data);
            }
            else {
                setOutput('An error occurred\n' + error.response.data.data.cmd);
            }
        }
        finally {
            setIsLoading(false);

        }
    };

    // const handleInputChange = (e) => {
    //     setInputValue(e.target.value);
    // };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(meetId ? meetId : 'No meeting ID set');
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };


    const handleLeaveRoom = async () => {
        //     socketRef.current?.emit('user-left', { meetingId });
        //     socketRef.current?.off('userJoined');
        //     socketRef.current?.off('code-sync');
        try {
            socketRef.current.emit('userDisconnect', { userId, username, meetingId });
            socketRef.current?.disconnect();
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
        }
    };

    const handleLeaveWorkspace = async () => {
        //     socketRef.current?.emit('user-left', { meetingId });
        //     socketRef.current?.off('userJoined');
        //     socketRef.current?.off('code-sync');
        try {
            const response = await axiosInstance.post('/api/v1/project/leaveWorkspace', { meetingId, userId });
            const { team } = response.data.workspace;
            if (response) {
                dispatch(setTeam(team));
                socketRef.current.emit('userDisconnect', { userId, meetingId })
                socketRef.current?.disconnect();
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <>
            <div className="drawer min-h-screen absolute top-4 left-10 lg:w-1/2 w-full overflow-y-auto ">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={toggleDrawer} />
                <div className="drawer-content w-1/2 ">

                    <label className="btn btn-circle swap swap-rotate" htmlFor='my-drawer'>

                        <input type="checkbox" />

                        <svg className={isDrawerOpen ? "swap-on fill-current" : "swap-off fill-current"} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>

                        <svg className={isDrawerOpen ? "swap-off fill-current" : "swap-on fill-current"} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>
                    </label>
                </div>
                <div className={`drawer-side mt-20 ${isDrawerOpen ? 'open' : 'closed'} `}>

                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay " onClick={toggleDrawer}></label>
                    <div className="menu  w-72  bg-base-200 text-base-content flex gap-4 h-full items-center ">
                        <div className="drawer min-h-screen absolute top-4 left-10 lg:w-1/2 w-full overflow-y-auto">
                            <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={toggleDrawer} />

                            {/* Drawer Toggle Button */}
                            <div className="absolute top-4 left-4 border-2 border-red-700">
                                <label
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 hover:bg-gray-800 cursor-pointer transition-colors border-2 border-red-700"
                                    htmlFor="my-drawer"
                                >
                                    {isDrawerOpen ? (
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </label>
                            </div>

                            {/* Sidebar Content */}
                            <div
                                className={`fixed w-full top-0 left-0 max-h-screen h-[650px]  transform transition-transform duration-300 ease-in-out  ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                                    } bg-gray-900 text-gray-300 shadow-xl`}
                            >
                                <div className="flex flex-col h-full">
                                    {/* Meeting Info Section */}
                                    <div className="p-4 space-y-4">
                                        {teamType === "team" && (
                                            <div className="space-y-2">
                                                <div className="space-y-1">
                                                    <h2 className="text-sm font-medium text-gray-400">Meeting ID</h2>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={meetId ? ` ${meetId}` : "No meeting ID set"}
                                                            readOnly
                                                            className="w-full px-3 py-2 text-sm bg-gray-800 rounded border border-gray-700 focus:outline-none"
                                                        />
                                                        <button
                                                            onClick={copyToClipboard}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                                        >
                                                            {copied ? (
                                                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <h2 className="text-sm font-medium text-gray-400">Meeting Name</h2>
                                            <input
                                                type="text"
                                                value={meetName ? `${meetName}` : "No meeting name set"}
                                                readOnly
                                                className="w-full px-3 py-2 text-sm bg-gray-800 rounded border border-gray-700 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Team Members List */}
                                    <div className="flex-1 overflow-y-auto px-4 py-2">
                                        <div className="space-y-2">
                                            {teamMembers?.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className={`p-2 rounded-lg bg-gray-800 flex items-center gap-2 border ${member.status === "online" ? "border-green-600" : "border-gray-600"
                                                        }`}
                                                >
                                                    <Avatar name={member.username} size="32" round={true} src={member.photoUrl || ""} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-sm truncate">{member.username}</span>
                                                            {member.id === userId && <span className="text-xs text-gray-400">(You)</span>}
                                                            {member.id === host && <span className="text-xs text-green-500">(Host)</span>}

                                                        </div>
                                                    </div>
                                                    {userId === host && member.id !== userId && (
                                                        <div className="relative">
                                                        <button
                                                          className="p-1 rounded transition-colors"
                                                          onClick={() => setShowMenu((prev) => !prev)}
                                                        >
                                                          <FontAwesomeIcon icon={faEllipsisVertical} className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                                        </button>
                                                  
                                                        {showMenu && (
                                                          <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-10">
                                                            <button
                                                              className="w-full px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
                                                              onClick={() => {
                                                                removeTeamMembers(member.id);
                                                                setShowMenu(false); // Close the menu after removing
                                                              }}
                                                            >
                                                              Remove
                                                            </button>
                                                          </div>
                                                        )}
                                                      </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="p-4 space-y-3 border-t border-gray-800 ">
                                        <button
                                            onClick={handleLeaveRoom}
                                            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                                        >
                                            Leave Room
                                        </button>

                                        {teamType === "team" && (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-px bg-gray-800" />
                                                    <span className="text-xs text-gray-500">or</span>
                                                    <div className="flex-1 h-px bg-gray-800" />
                                                </div>

                                                <button
                                                    onClick={() => document.getElementById("my_modal_1").showModal()}
                                                    className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                                                >
                                                    Leave Workspace
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leave Workspace Modal - Keeping the existing modal code */}
                        <dialog id="my_modal_1" className="modal">
                            <div className="modal-box absolute top-44 w-1/3 h-72  flex flex-col gap-0 overflow-hidden">
                                <div className=" mt-4 flex justify-center items-center"><img src="/images/warning.png" className=' w-12 h-12' alt="" /></div>
                                <div className='  flex flex-col justify-center items-center '>
                                    <h1 className=' font-extrabold text-2xl text-red-700 text-center '>Warning</h1>
                                    <p className=' text-center text-lg'>
                                        Once you exit this workspace, your code will be erased, and you won't be able to retrieve or access it again.
                                    </p>

                                </div>
                                <div className="modal-action  flex justify-center gap-6">
                                    <form method="dialog">
                                        {/* if there is a button in form, it will close the modal */}
                                        <button className="btn w-32 bg-primary text-white">Close</button>
                                    </form>

                                    <button class='btn bg-red-600 w-32' onClick={handleLeaveWorkspace}>Leave</button>
                                </div>
                            </div>
                        </dialog>

                    </div>
                </div>
            </div>




            <div className={`flex p-4 h-auto min-h-fit  md:flex-row flex-col md:overflow-y-hidden overflow-y-auto  gap-4 ${isDrawerOpen ? 'w-4/5 ml-72' : 'w-full'}`}>

                {/* Input section */}
                <div className=" pr-3 relative z-30 md:w-1/2 w-full  ">

                    <div className="navbar bg-base-300 rounded-box flex justify-between ">

                        {/* <div>
                            <button className=' btn bg-primary text-secondary-content hover:bg-base-100 hover:text-base-content text-sm flex'>
                                create a file
                                {/* <span><FontAwesomeIcon icon={faFolderPlus} /></span> */}
                        {/* </button> */}
                        {/* </div>  */}

                        <div className="flex px-2 ">
                            <ul className="menu menu-horizontal bg-base-200 rounded-box">
                                {/* <li><button
                                    className={language === 'javascript' ? 'font-bold text-blue-500' : ''}
                                    onClick={() => onSelectLanguage('javascript')}
                                    disabled={!isHost}>
                                    Javascript
                                </button></li> */}
                                <li><button
                                    className={language === 'python' ? 'font-bold text-blue-500' : ''}
                                    onClick={() => {
                                        if (!isHost) {
                                            toast.error('Only the host can change the language.');
                                        } else {
                                            onSelectLanguage('python');
                                        }
                                    }}

                                >
                                    Python
                                </button></li>
                                {/* <li><button
                                    className={language === 'java' ? 'font-bold text-blue-500' : ''}
                                    onClick={() => onSelectLanguage('java')}
                                    disabled={!isHost}>
                                    Java
                                </button></li> */}
                                <li><button
                                    className={language === 'cPlusPlus' ? 'font-bold text-blue-500' : ''}
                                    onClick={() => {
                                        if (!isHost) {
                                            toast.error('Only the host can change the language.');
                                        } else {
                                            onSelectLanguage('cPlusPlus');
                                        }
                                    }}
                                >
                                    C++
                                </button></li>
                            </ul>
                        </div>
                        <div className="flex justify-end flex-1 px-2">
                            <div className="flex items-stretch gap-3">
                                <button onClick={codeSave} className=' btn bg-primary text-secondary-content hover:bg-base-100 hover:text-base-content'>
                                    Save
                                </button>
                                <label className="flex cursor-pointer gap-2 my-3">
                                    <input type="checkbox" className="toggle theme-controller" onClick={toggleTheme} />
                                </label>

                            </div>
                        </div>
                    </div>
                    <Editor
                        height="85vh"
                        theme={theme}
                        onMount={onMount}
                        defaultLanguage={language}
                        defaultValue={value}
                        value={value}
                        onChange={handleCodeChange}
                    />
                </div>

                {/* output section */}
                <div className='lg:w-1/2 pl-3 relative z-30 bg-base-200 rounded-lg w-full h-96 lg:h-screen'>
                    <div className='bg-black-200 rounded-md p-4 h-full flex flex-col justify-between'>
                        <div className=' flex items-center bg-base-300 rounded-md h-20 justify-between p-9'>
                            <h2 className="text-2xl font-extrabold mb-4 ">Output</h2>

                            <button className="btn btn-outline  btn-success" onClick={runCode} disabled={isLoading}>
                                {isLoading ? 'Running...' : 'Run'}
                                <span><FontAwesomeIcon icon={faPlay} /></span>

                            </button>

                        </div>
                        {/*                         
                        <input
                            type="text"
                            className="border border-gray-300 p-2 w-full mb-4"
                            placeholder="Enter input..."
                            value={inputValue}
                            onChange={handleInputChange}
                        /> */}

                        <textarea
                            className="flex-1 border border-gray-300 p-2"
                            placeholder="Output will appear here..."
                            value={output || ''}  // Ensure it's never null
                            readOnly
                            style={{ color: isError ? 'red' : 'inherit' }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditorComponent;
