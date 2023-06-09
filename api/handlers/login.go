package handlers

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"

	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type LoginUser struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Email         string `json:"email"`
	UID           string `json:"uid"`
	FamilyID      int    `json:"family_id"`
	Phonetic      string `json:"phonetic"`
	Zipcode       string `json:"zipcode"`
	Prefecture    string `json:"prefecture"`
	City          string `json:"city"`
	Town          string `json:"town"`
	Apartment     string `json:"apartment"`
	PhoneNumber   string `json:"phone_number"`
	IsOwner       bool   `json:"is_owner"`
	IsVirtualUser bool   `json:"is_virtual_user"`
}

type LoginedUser struct {
	ID            int  `json:"id"`
	FamilyID      int  `json:"family_id"`
	IsOwner       bool `json:"is_owner"`
	IsVirtualUser bool `json:"is_virtual_user"`
}

func Login(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// セッションIDとしてハッシュ化したユーザーIDをCookieにセット
		// cookie := &http.Cookie{
		// 	Name:  "sessionId",
		// 	Value: "2588663",
		// 	Path:  "/",

		// 	Expires:  time.Now().Add(24 * time.Hour),
		// 	SameSite: http.SameSiteNoneMode, // SameSite属性を"None"に設定
		// 	Secure:   true,                  // Secure属性を設定
		// 	HttpOnly: true,                  // HttpOnly属性を設定
		// }
		w.Header().Set("Set-Cookie", "sessionId=2588663; Path=/; Expires=Sat, 10 Jun 2023 06:51:30 GMT; HttpOnly; Secure; SameSite=None")

		// http.SetCookie(w, cookie)

		// jsonData, err := json.Marshal("{}")
		// if err != nil {
		// 	log.Fatal(err)
		// }

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("cookie test"))
		// fmt.Printf("ボックリ")
		// w.Write(jsonData)

		// authHeader := r.Header.Get("Authorization")
		// token := strings.Split(authHeader, " ")[1]

		// log.Printf("\x1b[31merror: %s\x1b[0m", authHeader)

		// // Firebase Admin SDKを初期化する
		// opt := option.WithCredentialsFile("./Omusubi-serviceAccountKey.json")
		// app, err := firebase.NewApp(context.Background(), nil, opt)
		// if err != nil {
		// 	// エラー処理
		// 	log.Fatal(err)
		// }

		// // アクセストークンを検証する
		// authClient, err := app.Auth(context.Background())
		// if err != nil {
		// 	// エラー処理
		// 	log.Fatal(err)
		// 	http.Error(w, "Failed to create firebase auth client", http.StatusInternalServerError)
		// 	return
		// }

		// // tokenInfoには検証済みのトークン情報が含まれている
		// tokenInfo, err := authClient.VerifyIDToken(context.Background(), token)
		// if err != nil {
		// 	log.Fatal(err)
		// 	http.Error(w, "Invalid access token", http.StatusUnauthorized)
		// 	return
		// }

		// // 検証済みトークンからuidを取得
		// uid := tokenInfo.Claims["user_id"].(string)

		// fmt.Printf(uid)

		// var resData LoginedUser

		// err = db.QueryRow("SELECT id, family_id FROM users WHERE uid = ?", uid).Scan(&resData.ID, &resData.FamilyID)
		// if err != nil {
		// 	log.Fatal(err)
		// }

		// // セッションIDとしてハッシュ化したユーザーIDを作成
		// hashedID := hashSHA256(strconv.Itoa(resData.ID))

		// fmt.Printf(hashedID)

		// // セッションIDとユーザー情報をMySQLに保存
		// _, err = db.Exec("INSERT INTO sessions (session_id, user_id) VALUES (?, ?)", hashedID, resData.ID)
		// if err != nil {
		// 	log.Fatal(err)
		// }

		// // セッションIDとしてハッシュ化したユーザーIDをCookieにセット
		// cookie := &http.Cookie{
		// 	Name:     "sessionId",
		// 	Value:    hashedID,
		// 	Path:     "/",
		// 	Expires:  time.Now().Add(24 * time.Hour),
		// 	SameSite: http.SameSiteNoneMode, // SameSite属性を"None"に設定
		// 	Secure:   true,                  // Secure属性を設定
		// 	HttpOnly: true,                  // HttpOnly属性を設定
		// }
		// http.SetCookie(w, cookie)

		// jsonData, err := json.Marshal(resData)
		// if err != nil {
		// 	log.Fatal(err)
		// }
		// w.Header().Set("Content-Type", "application/json")
		// fmt.Printf("ボックリ")
		// w.Write(jsonData)

	}
}

// ユーザーIDをSHA-256でハッシュ化する関数
func hashSHA256(input string) string {
	hasher := sha256.New()
	hasher.Write([]byte(input))
	hashedBytes := hasher.Sum(nil)
	hashedString := hex.EncodeToString(hashedBytes)
	return hashedString
}
