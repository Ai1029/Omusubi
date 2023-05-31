package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"api/config"
	"api/handlers"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	cfg, err := config.LoadMySQLConfig()
	if os.Getenv("DB_ENV") == "production" {
		cfg.Host = os.Getenv("MYSQL_SERVER")
		cfg.User = os.Getenv("MYSQL_USER")
		cfg.Password = os.Getenv("MYSQL_PASSWORD")
	}

	if err != nil {
		panic(err)
	}
	// MySQLに接続します
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DBName))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	r := mux.NewRouter()
	// CORSを許可するためのミドルウェアの設定
	corsMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	}

	r.HandleFunc("/buy", handlers.CreateCheckoutSesstion(db)).Methods("POST")
	http.ListenAndServe(":8080", corsMiddleware(r))

}
