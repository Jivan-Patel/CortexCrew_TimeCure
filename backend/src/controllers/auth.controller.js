import accountModel from "../models/account.model.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import sessionModel from "../models/session.model.js"

export async function checkAdmin(req, res) {
    const adminExists = await accountModel.exists({ role: "doctor" });
    res.status(200).json({ hasAdmin: !!adminExists });
}

export async function register(req,res){
    const {username , email , password, role} = req.body;

    const isAlreadyRegistered = await accountModel.findOne({
        $or: [
            { name: username },
            { email }
        ]
    });

    if(isAlreadyRegistered){
        return res.status(400).json({message : "user already exist"});
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await accountModel.create({
        name: username,
        email,
        password: hashedPassword,
        role: role || 'patient'
    });
//////////////////// this for only using access token ////////////////////
    // const token = jwt.sign({
    //     id:user._id
    // }, config.JWT_SECRET, {
    //     expiresIn: "1h"
    // });

    // res.status(201).json({
    //     message: "user registered successfully",
    //     user:{
    //         username: user.name,
    //         email: user.email
    //     },
    //     token
    // });
    //////////////////////////////////////////////////////////////////////////
    //////////////////// this for using refresh token ////////////////////

    const refreshToken = jwt.sign({
        id:user._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    });

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user:user._id,
        refreshTokenHash,
        ip: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "unknown"
    })

    const accessToken = jwt.sign({
        id:user._id,
        role: user.role,
        sessionId: session.id,
    }, config.JWT_SECRET, {
        expiresIn: "15min"
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000
    })

    res.status(201).json({
        message: "user registered successfully",
        user:{
            username: user.name,
            email: user.email
        },
        accessToken
    });
//////////////////////////////////////////////////////////////////////////

}

export async function getMe(req,res){
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(404).json({message: "token not found"});
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await accountModel.findById(decoded.id);

    res.status(200).json({
        message: "user fetched successfully",
        user:{
            username: user.name,
            email: user.email
        }
    });
}

export async function refreshToken(req,res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            "message":"refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    //////////////////// for log out ////////////////
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshToken,
        revoked: false
    })
    if(!session){
        return res.status(401).json({
            message : "invalid refresh token"
        })
    }
    /////////////////////////////////////////////////

    const accessToken = jwt.sign({
        id:decoded._id
    },config.JWT_SECRET,
        {
            expiresIn:"15m"
        }
    )
    const newrefreshToken = jwt.sign({
        id:decoded._id
    },config.JWT_SECRET,
        {
            expiresIn:"7d"
        }
    )

    const newrefreshTokenHash = crypto.createHash("sha256").update(newrefreshToken).digest("hex");

    session.refreshTokenHash = newrefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newrefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    
    res.status(200).json({
        message:"access token refresh successfully",
        accessToken
    })


}

/////////// Log out ///////////

export async function logOut(req,res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            message:"refresh token not found in cookies"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    });

    if(!session){
        return res.status(404).json({
            message:"invalid refresh token"
        })
    }

    session.revoked = true;

    await session.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
        message:"logged out successfully"
    })
}

export async function logOutAll(req,res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(404).json({
            messasge:"token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    await sessionModel.updateMany({
        user:decoded.id,
        revoked : false
    },{
        revoked : true
    })

    res.clearCookie("refreshToken")

    res.status(200).json({
        message:"logged out from all devices successfully"
    })
}

export async function login(req,res){
    const {email, password} = req.body;

    const user = await accountModel.findOne({email})

    if(!user){
        return res.status(404).json({
            message:"no email match"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const isPasswordValid = hashedPassword === user.password;

    if(!isPasswordValid){
        return res.status(404).json({
            message:"password is incorrect"
        })
    }

    const refreshToken = jwt.sign({
        id:user._id
    }, config.JWT_SECRET,{
        expiresIn:"7d"
    })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user:user._id,
        refreshTokenHash,
        ip: req.ip || "unknown",
        userAgent: req.headers["user-agent"] || "unknown"
    })

    const accessToken = jwt.sign({
        id:user._id,
        role: user.role,
        sessionId:session._id
    },config.JWT_SECRET,{
        expiresIn:"15m"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:true,
        sameSite:"strict",
        maxAge: 7*24*60*60000
    })

    res.status(200).json({
        message : "logged in successfully",
        user: {
            username: user.name,
            email: user.email,
            role: user.role
        },
        accessToken
    })
}