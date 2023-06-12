package handlers

import (
	"database/sql"
	"time"

	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func Logout(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// クッキーからsessionIdを取得
		_, err := r.Cookie("sessionId")
		if err != nil {
			// セッションIDが存在しない場合はログインしていないと判断
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}
		// Cookieを削除するための空のCookieを作成
		deleteCookie := &http.Cookie{
			Name:     "sessionId",
			Value:    "",
			Path:     "/",
			Expires:  time.Now().AddDate(-1, 0, 0), // 過去の日時で有効期限を設定
			SameSite: http.SameSiteNoneMode,
			Secure:   true,
			HttpOnly: true,
		}

		// クライアントに削除するCookieを送信
		http.SetCookie(w, deleteCookie)

	}
}
