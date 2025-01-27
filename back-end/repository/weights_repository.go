package repository

import (
	"back-end-go/model"
	"database/sql"
	"strconv"
	"time"
)

func AddWeightHorse(db *sql.DB, weight *model.Weights, id string) error {
	weight.CreatedAt = time.Now().Format(time.RFC3339);
	var errId error;
	weight.FkHorseId, errId = strconv.Atoi(id);
	if errId != nil {
		return errId
	}
	query := "INSERT INTO weights (weight, date, fk_horse_id, created_at) VALUES (?, ?, ?, ?)"
	_, err := db.Exec(query, weight.Weight, weight.Date, weight.FkHorseId, weight.CreatedAt)
	return err
}