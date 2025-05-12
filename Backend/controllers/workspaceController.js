const User = require('../model/User');
const WorkspaceModel = require('../model/Workspace');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
// let compiler = require('compilex');
// let options = {stats : true}; //prints stats on console 
// compiler.init(options)
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');




const createSoloWorkspace = async (req, res) => {
    const { name, fileName, language, username, photoUrl } = req.body; // Added username and photoUrl
    const { userId } = req.params;

    if (!name || !fileName || !language || !userId || !username || !photoUrl) { // Validate all inputs
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide all project details' });
    }

    try {
        const workspace = await WorkspaceModel.create({
            name,
            fileName,
            language,
            type: 'solo',
            host: { id: userId, username, photoUrl },
        });
        res.status(StatusCodes.CREATED).json({ workspace });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const createTeamWorkspace = async (req, res) => {
    const { name, fileName, language, username, photoUrl } = req.body;
    const { userId } = req.params;

    if (!name || !fileName || !language || !userId || !username || !photoUrl) { 
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide all project details' });
    }

    try {
        // Create the workspace with the host as a team member
        const workspace = new WorkspaceModel({
            name,
            fileName,
            language,
            type: 'team',

            host: { id: userId, username, photoUrl },
            team: [{ id: userId, username, photoUrl, status: 'online' }]
        });

        await workspace.save(); 

        res.status(StatusCodes.CREATED).json({ workspace });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};


const joinTeam = async (req, res) => {
    const { userId } = req.params; // user ID from route params
    const { meetingId, username, photoUrl } = req.body; // data from request body
    const status = 'online'; 

    try {
        // Find the workspace
        const workspace = await WorkspaceModel.findOne({ _id: meetingId });

        if (!workspace) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Workspace not found" });
        }

        const userIndex = workspace.team.findIndex(member => member.id === userId);

        if (userIndex === -1) {
            // User not present, add them to the team
            workspace.team.push({ id: userId, username, photoUrl, status });
        } else {
            console.log('User already present in the team');
            // User is present, update status to online
            workspace.team[userIndex].status = status;
        }

        // Save the workspace with updated team
        const updatedWorkspace = await workspace.save(); 

        // Log the updated workspace
        // console.log('Updated Workspace:', updatedWorkspace);

        res.status(StatusCodes.OK).json({ workspace: updatedWorkspace });
    } catch (error) {
        console.error("Error joining team:", error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};






const showTeam = async (req,res) => {
    const {roomId} = req.body;
    if(!roomId){
        throw new customError.BadRequestError('Please provide Meeting ID');
    }
    try{
        const workspace = await WorkspaceModel.findOne({_id:roomId});
        res.status(StatusCodes.OK).json({ workspace });
    }
    catch(error){
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}

const savedWorkspace = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      throw new customError.BadRequestError('Please provide User ID');
    }
  
    try {
      const workspaces = await WorkspaceModel.find({
        $or: [
          { team: { $elemMatch: { id: userId } } }, 
          { 'host.id': userId }                           
        ]
      });
  
      res.status(StatusCodes.OK).json({ workspaces });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  };
  

const deleteWorkspace = async (req, res) => {
    const { workspaceId } = req.params;
  
    try {
      
      const deletedWorkspace = await WorkspaceModel.findByIdAndDelete(workspaceId);
  
      if (!deletedWorkspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }
  
      return res.status(200).json({ message: 'Workspace deleted successfully',  });
    } catch (error) {
      console.error('Error deleting workspace:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

const saveChat = async (req,res) => {
    const { meetingId, message,username,userId,photoUrl } = req.body;
    if(!meetingId){
        throw new customError.BadRequestError('Please provide Room ID');
    }
    try{
        const workSpace = await WorkspaceModel.findOne({_id:meetingId});
        workSpace.chat.push({msg:message,id:userId,username:username,photoUrl:photoUrl });
        await workSpace.save();
        res.status(StatusCodes.OK).json({ workSpace });
    }
    catch{
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }

};

const getChat = async(req,res)=>{
    const {meetingId} = req.params;
    try{
        const workSpace =await WorkspaceModel.findOne({_id:meetingId});
        if (!workSpace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }
        res.status(StatusCodes.OK).json({ workSpace });
    }
    catch(error){
        console.log('Error fetching messages:', error);
    }
}

const saveCode = async (req,res) => {
    const meetingId = req.body.meetingId;
    const code = req.body.code;
    try{
        const workspace = await WorkspaceModel.findOne({_id:meetingId});
        const lang = workspace.language
        workspace.code[lang] = code;
        await workspace.save();
       
        res.status(StatusCodes.OK).json({ workspace });
    }
    catch(error){
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const languageSelector = async (req,res) => {
    const meetingId = req.body.meetingId;
    const lang = req.body.language;
    try{
        const workspace = await WorkspaceModel.findOne({_id:meetingId});
        workspace.language = lang;
        await workspace.save();
       
        res.status(StatusCodes.OK).json({ workspace });
    }
    catch(error){
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const leaveWorkspace = async (req, res) => {
    const {meetingId, userId} = req.body;
    if(!meetingId){
        throw new customError.BadRequestError('Please provide Meeting ID');
    }

    try {
        const workspace = await WorkspaceModel.findOne({_id:meetingId});
        const newTeam = workspace.team.filter(member => member.id != userId);
        workspace.team = newTeam;
        await workspace.save();
        res.status(StatusCodes.OK).json({ workspace });
    } catch (error) {
        console.log(error);
    }
};

const removeTeamMembers = async (req,res)=>{
    const {meetingId, userId} = req.body;
    if(!meetingId || !userId){
        throw new customError.BadRequestError('Please provide Meeting ID and User ID');
    }

    try {
        const workspace = await WorkspaceModel.findOne({_id:meetingId});
        const newTeam = workspace.team.filter(member => member.id != userId);
        workspace.team = newTeam;
        await workspace.save();
        res.status(StatusCodes.OK).json({ workspace });
    } catch (error) {
        console.log(error);   
    }
}

// const runCode = async (req,res) => {
//     const code = req.body.code;
//     const input = req.body.input;
//     const lang = req.body.language;
//     try{
//         if(lang == 'python'){
//             if(input==''){
//                 let envData = {OS :"windows"};
//                 compiler.compilePython(envData,code,function(data){
//                     res.status(StatusCodes.OK).json({ data });
//                 });
//             }
//             else{
//                 let envData = {OS :"windows"};
//                 compiler.compilePythonWithInput(envData,code,input,function(data){
//                     res.status(StatusCodes.OK).json({ data });
//                 });
//             }
//         }
//         else if(lang == 'java'){
//             if(input == ''){
//                 let envData = {OS :"windows"};
//                 compiler.compileJava(envData,code,function(data){
//                     res.status(StatusCodes.OK).json({ data });
//                 });
//             }else{
//                 let envData = {OS :"windows"};
//                 compiler.compileJavaWithInput(envData,code,input,function(data){
//                     res.status(StatusCodes.OK).json({ data });
//                 });
//             }
//         }
//         else if(lang == 'cPlusPlus'){
//             if(input == ''){
//                 let envData = {OS :"windows"};
//                 compiler.compileCPP(envData,code,function(data){
//                     res.status(StatusCodes.OK).json({ data });
//                 });
//             }
//             else{
//                 let envData = {OS :"windows"};
//                 compiler.compileCPPWithInput(envData,code,input,function(data){
//                     res.status(StatusCodes.OK).json({ data });
//                 });
//             }
//         }
           
//     }catch(error){
//         console.log(error);
//     }finally{
//         compiler.flush(function(){
//             console.log('All temporary files flushed !'); 
//         });
//     }
// };

const runCode = async (req, res) => {
    const code = req.body.code;
    const lang = req.body.language;
    let tempFilePath;

    try {
        const folderPath = path.join('temp');

        // Create the directory if it doesn't exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        if (lang === 'python') {
            tempFilePath = path.join(folderPath, 'temp.py');
            // Write the code in the temporary file
            fs.writeFile(tempFilePath, code, (err) => {
                if (err) {
                    console.error('Error writing code to file:', err);
                    res.status(500).send('Error writing code to file');
                    return;
                }
                // Run the code using the temporary file
                exec(`python ${tempFilePath}`, (error, stdout, stderr) => {
                    if (error) {
                        res.status(500).json({data:error.message});
                        return;
                    }
                    if (stderr) {
                        res.status(500).json({data:stderr});
                        return;
                    }
                    res.send(stdout.trim()); // Send output to the client

                    // Remove the temporary file after the Python process has finished
                    fs.unlink(tempFilePath, (err) => {
                        if (err) {
                            console.error('Error removing temporary file:', err);
                        } else {
                            console.log('Temporary file removed successfully');
                        }
                    });
                });
            });
        } else if (lang === 'cPlusPlus') {
            tempFilePath = path.join(folderPath, 'temp.cpp');
            // executableFile = path.join(folderPath, 'a');
            // Write the code in the temporary file
            fs.writeFile(tempFilePath, code, (err) => {
                if (err) {
                    console.error('Error writing code to file:', err);
                    res.status(500).send('Error writing code to file');
                    return;
                }
                // Compile and run the C++ code using g++
                exec(`g++ -o ${path.join(folderPath, 'a')} ${tempFilePath} && ${path.join(folderPath, 'a')}`, (error, stdout, stderr) => {
                    if (error) {
                        res.status(500).send({data:error});
                        return;
                    }
                    if (stderr) {
                        res.status(500).send({data:stderr});
                        return;
                    }
                    res.send(stdout.trim()); // Send output to the client

                    fs.unlink(tempFilePath, (err) => {
                        if (err) {
                            console.error('Error removing temporary file:', err);
                        } else {
                            console.log('Temporary file removed successfully');
                        }
                    });
                    
                    fs.unlink(path.join(folderPath, 'a'), (err) => {
                        if (err) {
                            console.error('Error removing temporary file:', err);
                        } else {
                            console.log('Temporary file removed successfully');
                        }
                    });
                    
                });
            });
        } else if (lang === 'java') {
           
            const classRegex = /public\s+class\s+(\w+)\s*\{/;
            const match = code.match(classRegex);

            if (!match || match.length < 2) {
                res.status(400).send('Unable to determine class name');
                return;
            }

            const className = match[1]; // Extract the class name from the match

            tempFilePath = path.join(folderPath, `${className}.java`);
            
            // Write the code in the temporary file
            fs.writeFile(tempFilePath, code, (err) => {
                if (err) {
                    console.error('Error writing code to file:', err);
                    res.status(500).send('Error writing code to file');
                    return;
                }
                
                // Compile and run the Java code using javac and java
                exec(`javac ${tempFilePath} && java -classpath ${folderPath} ${className}`, (error, stdout, stderr) => {
                    if (error) {
                        res.status(500).send({data:error});
                        return;
                    }
                    if (stderr) {
                        res.status(500).send({data:stderr});
                        return;
                    }
                    res.send(stdout.trim()); // Send output to the client
                    
                    fs.unlink(tempFilePath, (err) => {
                        if (err) {
                            console.error('Error removing temporary file:', err);
                        } else {
                            console.log('Temporary file removed successfully');
                        }
                    });
                    fs.unlink( path.join(folderPath, `${className}.class`), (err) => {
                        if (err) {
                            console.error('Error removing temporary file:', err);
                        } else {
                            console.log('Temporary class removed successfully');
                        }
                    });
                });
            });
        } else if (lang === 'javascript') {
            // For JavaScript, simply execute the code using Node.js
            exec(`node -e "${code}"`, (error, stdout, stderr) => {
                if (error) {
                    res.status(500).json({data: error});
                    return;
                }
                if (stderr) {
                    res.status(500).json({data:stderr});
                    return;
                }
                res.send(stdout.trim()); // Send output to the client
            });
        } else {
            res.status(400).send('Unsupported language');
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

module.exports = runCode;


module.exports = { createSoloWorkspace,createTeamWorkspace,joinTeam,showTeam,removeTeamMembers,savedWorkspace,deleteWorkspace,languageSelector,saveCode,runCode,leaveWorkspace,saveChat,getChat };
