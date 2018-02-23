const cors = require('cors')
const express = require('express')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
admin.initializeApp(functions.config().firebase);
const db = admin.firestore()

// exports.index = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// const hello = require('./hello');
// exports.helloWorld = hello.helloWorld

const app = express()
app.use(cors({
    origin: true // allows all cross origin xhr requests
}))
app.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({message: 'missing authorization header'})
    }
    let jwt = req.headers.authorization.trim()
    return admin.auth().verifyIdToken(jwt).then((claims) => {
        req.user = claims // gives us a user object to use below
        next()
    }).catch((err) => {
        return res.status(400).json({
        message: 'invalid jwt'
        })
    })
})
app.get('/express', (req, res) => {
    res.json({
        express: "Hello Express"
    })
})

app.post('/todo/shareId', (req, res) => {
  var userId = req.user.uid || null
  let todoId = req.body.todoId
  let shareId = req.body.shareId
  const todo = db.collection('test')
  let targetTodoRef = todo.doc(todoId)
  let seachTodoRef = todo.where("shareId", "==", shareId)

  db.runTransaction((tx) => {
    return tx.get(seachTodoRef).then((querySnapshot) => {
      if (querySnapshot.docs.length>0) {
        var err =  new Error('This Share ID is already userd by other')
        err.name = "SANE_SHARE_ID"
        throw err
      }
      return Promise.resolve()
    })
    .then(() => tx.get(targetTodoRef).then((doc)=>{
      console.log(doc.data())
      if(userId && doc.data().userId != userId){
        var err =  new Error("You are not a owner.")
        err.name = "NOT_OWNER"
        throw err
      }
      return Promise.resolve()
    }))
    .then(() => tx.update(targetTodoRef, {shareId: shareId}))
  }).then(() => {
    res.json({
      shareId: shareId, // return the formatted username
      message: 'successfully setting shareId'
    })
  }).catch((err) => {
    console.log(err.name, err.message)
    return res.status(err.message.status || 500).json({name:err.name, message:err.message})
  })
})
exports.api = functions.https.onRequest(app);