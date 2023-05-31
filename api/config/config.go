package config

import (
	"github.com/go-ini/ini"
)

const (
	ConfigFile = "config.ini"
)

type MySQLConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

func LoadMySQLConfig() (*MySQLConfig, error) {
	cfg, err := ini.Load("config.ini")
	if err != nil {
		return nil, err
	}

	section, err := cfg.GetSection("mysql")
	if err != nil {
		return nil, err
	}

	host := section.Key("host").String()
	port := section.Key("port").String()
	user := section.Key("user").String()
	password := section.Key("password").String()
	dbname := section.Key("dbname").String()

	return &MySQLConfig{
		Host:     host,
		Port:     port,
		User:     user,
		Password: password,
		DBName:   dbname,
	}, nil
}
