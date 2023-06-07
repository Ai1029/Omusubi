package handlers

import (
	"html/template"
	"log"
	"net/http"
	"time"

	uuid "github.com/satori/go.uuid"
)

// セッションID情報をcookieにセットする
func SetSessionID(w http.ResponseWriter, r *http.Request) {

	// セッションIDを生成
	uuid := uuid.NewV4()
	// UUIDを文字列として取得し、セッションIDとして使用
	sessionID := uuid.String()
	// 有効期限を設定（1時間）
	expiration := time.Now().Add(1 * time.Hour)
	log.Println("セッションIDを取得しました:", sessionID)

	// Cookieを作成
	cookie := &http.Cookie{
		Name:     "sessionID",
		Value:    sessionID,
		Path:     "/",
		Expires:  expiration,
		SameSite: http.SameSiteNoneMode, // SameSite属性を"None"に設定
		Secure:   true,                  // Secure属性を設定
		HttpOnly: true,                  // HttpOnly属性を設定
	}

	// セッションIDをCookieに保存
	http.SetCookie(w, cookie)
	log.Println("Cookieを設定しました:", cookie.String())
}

// cookieの取得を行い、htmlを返す
func ShowCookie(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("sessionID")

	if err != nil {
		log.Fatal("Cookie: ", err)
	}

	tmpl := template.Must(template.ParseFiles("./cookie"))
	tmpl.Execute(w, cookie)

}
