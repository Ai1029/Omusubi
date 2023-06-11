package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"api/config"
	"api/handlers"
	"api/stripeHandler"

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
	SITE_URL := "http://localhost:3000"
	if os.Getenv("DB_ENV") == "production" {
		SITE_URL = os.Getenv("SITE_URL")
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
			w.Header().Set("Access-Control-Allow-Origin", SITE_URL)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Credentials", "true") // cookie用に追加
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	}

	r.HandleFunc("/users", handlers.GetUsers(db)).Methods("GET")
	r.HandleFunc("/users/{id}", handlers.GetUser(db)).Methods("GET")
	r.HandleFunc("/users", handlers.CreateUsers(db)).Methods("POST")
	r.HandleFunc("/users", handlers.UpdateUser(db)).Methods("PATCH")
	r.HandleFunc("/family/{id}", handlers.GetFamily(db)).Methods("GET")
	r.HandleFunc("/family", handlers.CreateFamilyMenber(db)).Methods("POST")
	r.HandleFunc("/createsubscription", stripeHandler.CreateCheckoutSession(db)).Methods("POST")
	r.HandleFunc("/stripe_webhooks", stripeHandler.StripeWebhook(db)).Methods("POST")
	r.HandleFunc("/stripe_webhooks", stripeHandler.StripeWebhook(db)).Methods("GET")
	r.HandleFunc("/plans", handlers.GetPlans(db)).Methods("GET")
	r.HandleFunc("/plans", handlers.CreatePlan(db)).Methods("POST")
	r.HandleFunc("/plan/{id}", handlers.GetPlan(db)).Methods("GET")
	r.HandleFunc("/plan/{id}", handlers.PatchPlan(db)).Methods("PATCH")
	r.HandleFunc("/plan/{id}", handlers.DeletePlan(db)).Methods("DELETE")
	r.HandleFunc("/login", handlers.Login(db))
	// r.HandleFunc("/login", handlers.Login(db)).Methods("GET")
	r.HandleFunc("/subscriptions", handlers.GetSubscriptions(db)).Methods("GET")
	r.HandleFunc("/subscription/{id}", handlers.GetSubscription(db)).Methods("GET")
	r.HandleFunc("/subscription", handlers.CreateSubscription(db)).Methods("POST")
	r.HandleFunc("/cartusers/{id}", handlers.GetCartUsers(db)).Methods("GET")
	r.HandleFunc("/order", handlers.CreateOrder(db)).Methods("POST")
	r.HandleFunc("/session", handlers.SetSessionID)
	r.HandleFunc("/cookie", handlers.ShowCookie)
	r.HandleFunc("/check-session", handlers.CheckSession(db)).Methods("GET")

	http.ListenAndServe(":8080", corsMiddleware(r))

}
