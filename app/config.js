const nodemailer = require('nodemailer');
const path = require('path');
const isProd = process.env.NODE_ENV === 'prod';

module.exports = {
    jwtSecret: "MyS3cr3tK3Y",
    jwtSession: {
        session: false
    },
    PAGINATION_PERPAGE: 10,
    android_serverKey: 'AAAAO97IZwY:APA91bHS5QJA4GEPK8WcIM6Hb3sq--0dq7ZCb8GLgTIvOLUXFnIe2p3hLvw2hfmY46-xJP-NnsBsoRul98XNfQfwQ2U5PwFm31N_84ZPW_BHf3WqHAO-VTVlnMEQIqgpTa9Hhz0kTVlT',
    ios_key: path.join(__dirname, '/key_file/AuthKey_7XGMBSUZ7H.p8'),
    ios_keyId: '7XGMBSUZ7H',
    ios_teamId: 'H23W3EERLK',
    isProd,
    getPort: process.env.PORT || 1415,
    getAdminFolderName: process.env.ADMIN_FOLDER_NAME || 'admin',
    getApiFolderName: process.env.API_FOLDER_NAME || 'api',
    getFrontFolderName: process.env.FRONT_FOLDER_NAME || 'front',
    
    transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    }),
}