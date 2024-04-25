"use strict";
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userbase')
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Failed to connect to MongoDB'));
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const StudyListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    list: [{
            term: {
                type: String,
                required: true
            },
            definition: {
                type: String,
                required: true
            }
        }]
});
const LoginModel = mongoose.model('UserBase', LoginSchema);
const StudyListModel = mongoose.model('StudyList', StudyListSchema);
module.exports = {
    LoginModel,
    StudyListModel
};
