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
export const resetPassword = async(_account, _pass, _vcode) => {
    const player = await tempUser.findOne({ where: { email: _account} });
    console.log(player.vcode, _vcode);
    return new Promise(resolve => {
        if(player.vcode == null || player.vcode == undefined){
            resolve(false);
        }
        else if(player.vcode === _vcode){
            Players.findOne({
                where: {name: _account}
            }).then(player => {
                player.pass = _pass;
                player.save();
                resolve(true);
            })
        }
        else{
            resolve(false);
        }
    })
}
// nodemailer Transport 생성
export const sendMailReset = async(_account) => {
    const token = crypto.randomBytes(10).toString('hex');
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
        subject: '[MillRnft] 비밀번호 초기화 코드입니다.',
        html: '<!DOCTYPE html>'+
        '<html><head><title>initiate MillRnft password</title>'+
        '</head><body><div>'+
        '<p>millRnft의 비밀번호 초기화 메일입니다</p>'+
        '<p>아래의 코드를 복사하여 verification code란에 붙여넣으십시오.</p>'+
        `<p>${token}</p>`+
        '</div></body></html>'
    };
    return new Promise(resolve => {
        tempUser.create({
            email: _account,
            vcode: token
        })
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
            pass: '',
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
        <h3><a href="https://millrnft.com/signinpage">go to signin</a></h3>
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