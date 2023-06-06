import React, { useState } from "react";
import { NextPage } from "next";

const Complete : NextPage = () => {
    return (
        <div>
            <p>認証メールを送信しました</p>
            <p>認証メールに記載されたURLからプロフィール登録に進んでください</p>
        </div>        

    )
}

export default Complete;