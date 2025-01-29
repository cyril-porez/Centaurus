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

func GetLastWeightHorse(db *sql.DB, weight *model.Weights, horse *model.Horses,id string) error {
	query := `
			SELECT 
				h.name,
				w1.weight AS weight,
				w2.weight AS LastWeight,
				w1.weight - w2.weight AS DifferenceWeight,
				w1.date As date,
				w2.date As LastDate
				
			FROM horses AS h
			INNER JOIN weights AS w1
					ON h.id = w1.fk_horse_id
			LEFT JOIN weights AS w2
					ON w1.fk_horse_id = w2.fk_horse_id
					AND w1.date > w2.date
			WHERE h.id = ?
			ORDER BY w1.date DESC 
			LIMIT 1`;
	err := db.QueryRow(query, id).Scan(
				&horse.Name,
				&weight.Weight,
				&weight.LastWeight,
				&weight.DifferenceWeight, 
				&weight.Date, 
				&weight.LastDate,
			);
	return err;
}