package handlers

import (
	"api/config"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var Db *sql.DB

var err error

const (
	// tableNameSidedishes = "sidedishes"
	// tableNameOrders       = "orders"
	tableNameOrderdetails = "orderdetails"
	tableNamePlans        = "plans"
)

// sidedishesのtableがなければtableを作成する
func init() {
	Db, err = sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", config.Config.User, config.Config.Password, config.Config.Host, config.Config.Port, config.Config.DBName))
	if err != nil {
		log.Fatalln(err)
	}
	// cmdS := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s(
	// 	id INT(11) PRIMARY KEY AUTO_INCREMENT,
	// 	name VARCHAR(255),
	// 	explanation VARCHAR(255),
	// 	price VARCHAR(255),
	// 	quantity INT(11),
	// 	image VARCHAR(255)
	// 	)`, tableNameSidedishes)
	// //　cmdSを実行して、エラーが発生したらerrに格納する
	// _, err = Db.Exec(cmdS)
	// if err != nil {
	// 	log.Fatalln(err)
	// }

	// cmdO := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s(
	// 	id INT(11) PRIMARY KEY AUTO_INCREMENT,
	// 	total_price VARCHAR(255),
	// 	order_date DATE
	// )`, tableNameOrders)
	// _, err = Db.Exec(cmdO)
	// if err != nil {
	// 	log.Fatalln(err)
	// }

	// orderidは後で追加する
	//　orderdetailリレーションテーブル
	// cmdD := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s(
	// 	id INT(11) PRIMARY KEY AUTO_INCREMENT,
	// 	sidedish_id INT(11),
	// 	quantity INT(11),
	// 	sidedish_name VARCHAR(255),
	// 	sidedish_explanation VARCHAR(255),
	// 	sidedish_price VARCHAR(255),
	// 	FOREIGN KEY (sidedish_id) REFERENCES %s(id)
	// )`, tableNameOrderdetails, tableNameSidedishes)

	// _, err = Db.Exec(cmdD)
	// if err != nil {
	// 	log.Fatalln(err)
	// }
	cmdP := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s(
		id INT(11) PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(255),
		explanation VARCHAR(255),
		price VARCHAR(255),
		image VARCHAR(255)
		)`, tableNamePlans)

	//　cmdSを実行して、エラーが発生したらerrに格納する
	_, err = Db.Exec(cmdP)
	if err != nil {
		log.Fatalln(err)
	}
}
