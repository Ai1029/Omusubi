package config

import (
	"log"

	"github.com/go-ini/ini"
)

const (
	ConfigFile = "config.ini"
)

// 外のファイルからも呼べるように宣言
var Config MySQLConfig

type MySQLConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

// main関数の前に実行させる
func init() {
	LoadMySQLConfig()
}

func LoadMySQLConfig() {
	cfg, err := ini.Load("config.ini")
	if err != nil {
		log.Fatalln(err)
	}
	Config = MySQLConfig{

		Host:     cfg.Section("mysql").Key("host").String(),
		Port:     cfg.Section("mysql").Key("port").String(),
		User:     cfg.Section("mysql").Key("user").String(),
		Password: cfg.Section("mysql").Key("password").String(),
		DBName:   cfg.Section("mysql").Key("dbname").String(),
	}
}
