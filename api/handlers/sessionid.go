package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
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
		Name:     "sessionId",
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

// セットしたcookieの確認
func ShowCookie(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("sessionId")
	if err != nil {
		log.Fatal("Cookie: ", err)
	}
	w.Header().Set("X-Cookie-Value", cookie.Value)
	w.WriteHeader(http.StatusOK)
}

type ResultUserID struct {
	UserID int `json:"user_id"`
}

// cookieにsessionIdが付与されているかを確認してユーザーがログインしているのか判断
func CheckSession(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// クッキーからsessionIdを取得
		cookie, err := r.Cookie("sessionId")
		if err != nil {
			// セッションIDが存在しない場合はログインしていないと判断
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}

		// セッションレコードをデータベースから取得
		var data ResultUserID
		err = db.QueryRow("SELECT user_id FROM sessions WHERE session_id = ?", cookie.Value).Scan(&data.UserID)
		if err != nil {
			// セッションが見つからない場合はログインしていないと判断
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}

		// 同じfamily_idを持つユーザーを取得
		rows, err := db.Query("SELECT * FROM users WHERE family_id IN (SELECT family_id FROM users WHERE id = ?)", data.UserID)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var users []User
		for rows.Next() {
			var user User
			if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.UID, &user.FamilyID, &user.Phonetic, &user.Zipcode, &user.Prefecture, &user.City, &user.Town, &user.Apartment, &user.PhoneNumber, &user.IsOwner, &user.IsVirtualUser); err != nil {
				log.Fatal(err)
			}
			users = append(users, user)
		}

		// レスポンスデータの作成
		response := struct {
			UserID int    `json:"user_id"`
			Family []User `json:"family"`
		}{
			UserID: data.UserID,
			Family: users,
		}

		// レスポンスをJSON形式で返す
		jsonData, err := json.Marshal(response)
		if err != nil {
			// エラーハンドリング
			fmt.Println(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)
	}
}