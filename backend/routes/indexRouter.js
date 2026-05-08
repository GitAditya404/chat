import express from 'express'
const router = express.Router()
import { google } from "googleapis"

import roomModel from '../models/roomModel.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'

router.get('/me' , isLoggedIn , (req,res) => {
  res.status(200).send('user verified')
})

router.get('/health' , (req,res) => {
  res.status(200).json({
    status : "OK" , 
    time : new Date()
  })
})

router.post('/createMeeting', isLoggedIn ,async (req,res) => {

    try{
        const { title, startTime, endTime, emails} = req.body
        const user = req.user;

        const oauth2Client = new google.auth.OAuth2()

        oauth2Client.setCredentials({
            access_token: user.googleAccessToken
        })

        const calendar = google.calendar({
            version: "v3",
            auth: oauth2Client
        })

        const event = await calendar.events.insert({

            calendarId: "primary",

            sendUpdates: "all",

            requestBody: {

                summary: title,

                start: {
                    dateTime: startTime + ":00",
                    timeZone: "Asia/Kolkata"
                },

                end: {
                    dateTime: endTime + ":00",
                    timeZone: "Asia/Kolkata"
                },

                attendees: emails.map(email => ({email}))
            }
        })

        return res.status(200).json({
          msg : "Meeting scheduled successfully"
        })
    }

    catch(err){
        console.log(err)

        return res.status(500).json({
            msg : "Meeting creation failed"
        })
    }

})

export default router