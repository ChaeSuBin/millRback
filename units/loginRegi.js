import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Players, tempUser } from '../models.js';

export const loginProc = async(body) => {
    return new Promise(resolve => {
        Players.findOne({
            where: {name: body.playerId}
        }).then(user => {
            try {
                if(user.pass === body.playerPass)
                    resolve(true);
                else
                  resolve(false);
            } catch (error) {
                resolve(false);
            }
        })
    })
}
export const checkExistId = async(_userId) => {
    return new Promise(resolve => {
        Players.findOne({
            where: {name: _userId}
        }).then(user => {
            if(user === null)
                resolve(false);
            else
                resolve(true);
        })
    })
}
export const matchCheck = async(_userId, _vcode) => {
    return new Promise(resolve => {
        tempUser.findOne({ where: { email: _userId}}).then(
            result => {
                if(result.vcode === _vcode)
                    resolve(true);
                else
                    resolve(false);
            }
        ).catch(err => {
            console.log(err);
            resolve(false);
        })
    })
}
const tempUserCheck = (_userId) => {
    return new Promise(resolve => {
        tempUser.findOne({ where: { email: _userId}}).then(
            tempuser => {
                if(tempuser !== null){
                    tempuser.destroy();
                }
                resolve(true);
            }
        )
    })
}
// nodemailer Transport 생성
export const sendMailRegi = async(_userId) => {
    await tempUserCheck(_userId);
    const token = crypto.randomBytes(20).toString('hex');
    const transporter = nodemailer.createTransport({
        host: 'smtp.naver.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: { // account info of sender address
            user: 'co-ra@naver.com',
            pass: process.env.SMTP_PWD,
        },
    });
    const emailOptions = { // set sending option
        from: `"co-ra" <co-ra@naver.com>`,
        to: _userId,
        subject: '계정생성을 완료하세요',
        html: '<!DOCTYPE html>'+
        '<html><head><title>signup MillR mintService</title>'+
        '</head><body><div>'+
        '<p>Thank you for your interest.</p>'+
        '<p>Please complete the account creation by input the verification code below</p>'+
        '<p>Here is Code for signup:</p>'+
        `<p>Verification Code: ${token}</p>`+
        // `<a href="https://mintservice.asuscomm.com:8139/regiplayer/${token}">create account</a>`+
        '</div></body></html>'
    };
    return new Promise(resolve => {
        tempUser.create({
            email: _userId,
            vcode: token
        })
        transporter.sendMail(emailOptions).then(result => {
            console.log(result);
            resolve(true);
        })
    })
}

export const regiComplete = (_userId, _pass, _ADDR) => {
	return new Promise(resolve => {
		Players.findOrCreate({
            where: {name: _userId},
            defaults: {
                name: _userId,
                pass: _pass,
                blockchainaddr: _ADDR
            }
        }).then(([newUser, create]) => {
            if(create)
                resolve(true);
            else{
                newUser.destroy();
                Players.create({
                    name: _userId,
                    pass: _pass,
                    blockchainaddr: _ADDR
                })
                resolve(true);
            }
        })
	})
}

// export const regiCompletePage = (_vcode) => {
//     const html = `<!doctype html>
//     <html>
//         <head>
//         <title>milR</title>
//         </head>
//         <body>
//         <h2>Your account has been created successfully</h2>
//         <h3><a href="https://millrnft.com/signinpage">go to signin</a></h3>
//         </body>
//     </html>`
// 	return new Promise(resolve => {
// 		tempUser.findOne({
// 			where: {vcode: _vcode}
// 		}).then(res => {
// 			Players.findOrCreate({
// 				where: {name: res.email},
// 				defaults: {
// 				  name: res.email,
// 				  pass: res.pass
// 				}
// 			  }).then(([newUser, create]) => {
// 				if(create)
// 					resolve(html);
// 				else
// 					resolve('the account password be changed');
// 			})
// 		})
// 	})
// }