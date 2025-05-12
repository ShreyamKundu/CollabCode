import { useEffect, useState } from "react"
import { axiosInstance } from "../../../utils/index"
import { useFirebase } from "../../Context/FirebaseContext"
import { Link } from "react-router-dom"
import Avatar from "react-avatar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

const Savedfile = () => {
  const { user } = useFirebase()
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(false)

  const handleWorkspaceClick = (workspaceId) => {
    console.log(`Clicked workspace with ID: ${workspaceId}`)
    // Add your logic here, e.g., navigate to the editor
  }

  const deleteWorkspace = async (workspaceId) => {
    try {
      await axiosInstance.delete(`/api/v1/project/deleteWorkspace/${workspaceId}`);
      const userId = user.uid;
      const response = await axiosInstance.post('/api/v1/project/savedWorkspace', { userId });
      const workspacesData = response.data.workspaces;
      setWorkspaces(workspacesData);
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };


  useEffect(() => {
    const fetchWorkspaces = async () => {

      if (!user) {
        console.error('No user found');
        return;
      }

      try {
        setLoading(true);
        const userId = user.uid;
        const response = await axiosInstance.post('/api/v1/project/savedWorkspace', { userId });
        const workspacesData = response.data.workspaces;
        console.log(workspacesData);
        setWorkspaces(workspacesData);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user]);


  return (
    <div className="p-8 mt-12 min-h-screen lg:ml-64">
      {loading ? (
        <div className="flex items-center justify-center w-full text-gray-400">Loading...</div>
      ) : workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-64 text-gray-400 bg-gray-900 border border-gray-800 rounded-lg">
          <p className="text-lg font-medium">No saved workspaces found.</p>
          <Link
            to="/create-workspace"
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition"
          >
            Create New Workspace
          </Link>
        </div>
      ) : (
        <div className="w-full border border-gray-800 rounded-lg bg-gray-900">
          <div className="grid grid-cols-6 gap-4 p-4 text-md font-medium text-blue-400 border-b border-red-400">
            <div>NAME</div>
            <div>TYPE</div>
            <div>HOST</div>
            <div>MEMBERS</div>
            <div className="text-center">LANGUAGE</div>
            <div className="text-center">ACTIONS</div>
          </div>
          <div className="divide-y divide-gray-800">
            {workspaces.reverse().map((workspace) => (
              <div
                key={workspace._id}
                className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-800/50 transition-colors"
              >
                <Link
                  to={`/editor/${workspace._id}`}
                  onClick={() => handleWorkspaceClick(workspace._id)}
                  className="font-medium text-white hover:underline"
                >
                  {workspace.name}
                </Link>
                <div className="text-gray-400">{workspace?.type}</div>
                <div className="flex items-center">
                  <div className="relative group">
                    <Avatar
                      name={workspace.host?.username}
                      size="32"
                      round={true}
                      color={Avatar.getRandomColor("sitebase", ["red", "green"])}
                      textSizeRatio={0.8}
                      src={workspace.host?.photoUrl || ""}
                    />
                    <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm transition-opacity duration-300 mb-2 whitespace-nowrap">
                      {workspace.host?.username}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {workspace.team
                      .filter((member) => member.id !== workspace.host?.id)
                      .slice(0, 3)
                      .map((member) => (
                        <div key={member.id} className="relative group">
                          <Avatar
                            name={member.username}
                            size="32"
                            round={true}
                            color={Avatar.getRandomColor("sitebase", ["red", "green"])}
                            textSizeRatio={0.8}
                            src={member.photoUrl || ""}
                          />
                          <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm transition-opacity duration-300 mb-2 whitespace-nowrap">
                            {member.username}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      ))}
                    {workspace.team.length > 4 && (
                      <div className="relative group">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white text-xs relative z-10">
                          +{workspace.team.length - 4}
                        </div>
                        <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm transition-opacity duration-300 mb-2 whitespace-nowrap">
                          {workspace.team
                            .filter((member) => member.id !== workspace.host?.id)
                            .slice(3)
                            .map((member) => member.username)
                            .join(", ")}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center text-gray-400">
                  {workspace?.language === "cPlusPlus" ? "C++" : workspace?.language}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => deleteWorkspace(workspace._id)}
                    className="p-2 text-red-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition"
                    aria-label="Delete workspace"
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Savedfile;