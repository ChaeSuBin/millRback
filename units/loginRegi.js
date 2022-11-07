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
// nodemailer Transport 생성
export const sendMailReset = async(_account, _reset) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.naver.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: { // account info of sender address
            user: 'co-ra@naver.com',
            pass: '',
        },
    });
    const emailOptions = { // set sending option
        from: `"co-ra" <co-ra@naver.com>`,
        to: _account,
        subject: '비밀번호 초기화 이메일입니다.',
        html: '아래의 URL로 접속하여 비밀번호 초기화를 완료하십시오.'
    };
    return new Promise(resolve => {
        transporter.sendMail(emailOptions).then(result => {
            console.log(result);
            resolve(result);
        })
    })
}
export const sendMailRegi = (_userId, _userPass) => {
    const token = crypto.randomBytes(20).toString('hex');
    const transporter = nodemailer.createTransport({
        host: 'smtp.naver.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: { // account info of sender address
            user: 'co-ra@naver.com',
            pass: 'newcv@ruf-02',
        },
    });
    const emailOptions = { // set sending option
        from: `"co-ra" <co-ra@naver.com>`,
        to: _userId,
        subject: '계정생성을 완료하세요',
        html: '<!DOCTYPE html>'+
        '<html><head><title>signup MilR mintService</title>'+
        '</head><body><div>'+
        '<p>Thank you for your interest.</p>'+
        '<p>Please complete the account creation by accessing the URL below</p>'+
        '<p>Here is URL for signup:</p>'+
        `<a href="https://mintservice.asuscomm.com:8139/regiplayer/${token}">create account</a>`+
        '</div></body></html>'
    };
    return new Promise(resolve => {
        tempUser.create({
            email: _userId,
            pass: _userPass,
            vcode: token
        })
        transporter.sendMail(emailOptions).then(result => {
            console.log(result);
            resolve(true);
        })
    })
}

export const regiCompletePage = (_vcode) => {
    const html = `<!doctype html>
    <html>
        <head>
        <title>milR</title>
        </head>
        <body>
        <h2>Your account has been created successfully</h2>
        <h3><a href="http://mintservice.asuscomm.com:3000/signinpage">go to signin</a></h3>
        </body>
    </html>`
	return new Promise(resolve => {
		tempUser.findOne({
			where: {vcode: _vcode}
		}).then(res => {
			Players.findOrCreate({
				where: {name: res.email},
				defaults: {
				  name: res.email,
				  pass: res.pass
				}
			  }).then(([newUser, create]) => {
				if(create)
					resolve(html);
				else
					resolve('the account password be changed');
			})
		})
	})
}