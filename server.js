import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Issue from './models/issue';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());// Content-type :application/json

//mongoose.connect('mongodb://localhost:27017/issues');
mongoose.connect('mongodb://root:anshul7931@ds225902.mlab.com:25902/issues_db',{ useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open',()=> {  //once the connection is open then.
    console.log("Connection is established successfully");
});

//Defining paths for http get

router.route('/issues').get((req,res)=>{
    Issue.find((err,issuesResult)=>{
        if(err)
            console.log(err);
        else
            res.json(issuesResult);
    });
});

router.route('/issues/:id').get((req,res)=>{
    Issue.findById(req.params.id,(err , IssueResult)=>{
        
        if(err)
            console.log(err);
        else
            res.json(IssueResult);
    });
});

//Defining paths from http post

router.route('/issues/add').post((req,res)=>{
    let IssueResult = new Issue(req.body);
    IssueResult.save().then(IssueResult=>{
        res.status(200).json({'issue':'Added Successfully'});
    }).catch(err => {
        res.status(400).send('Failed to create a new record');
    });
});

router.route('/issues/update/:id').post((req,res)=>{
    Issue.findById(req.params.id,(err , IssueResult)=>{
        if(!IssueResult)
            return next(new Error('Could not load the document'));
        else{
            IssueResult.title = req.body.title;
            IssueResult.responsible = req.body.responsible;
            IssueResult.description = req.body.description;
            IssueResult.severity = req.body.severity;
            IssueResult.status = req.body.status;

            IssueResult.save().then(IssueResult=>{
                res.status(200).json('Updated Successfully');
            }).catch(err => {
                res.status(400).send('Failed to update a new record');
            });
        }
    });
});

//This is a get call now 

router.route('/issues/delete/:id').get((req,res)=>{
    Issue.findByIdAndRemove({_id:req.params.id},(err,IssueResult)=>{
        if(err)
            console.log(err);
        else
            res.json('Removed successfully');
    });
});


//Getting all the router paths

app.use('/',router);

//app.get('/',(req,res)=>res.send('Hello World'));

app.listen(4000,()=> console.log('Express is running on localhost:4000'));