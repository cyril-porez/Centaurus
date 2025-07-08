package repository

import (
	"back-end-go/model"
	"database/sql"
	"fmt"
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
	_, err := db.Exec(query, weight.Weight, weight.CreatedAt, weight.FkHorseId, weight.CreatedAt)
	return err
}

func GetHorseWeights(db *sql.DB, id string, limit string, sort string) (*sql.Rows, error) {
	baseQuery := `
		SELECT 
			h.name, 
			w.created_at, 
			w.weight
		FROM horses AS h
			INNER JOIN weights AS w ON h.id = w.fk_horse_id
		WHERE h.id = ?
	`

	if sort == "desc" {
		baseQuery += " ORDER BY w.created_at DESC"
	} else {
		baseQuery += " ORDER BY w.created_at ASC"
	}

	if limit != "" {
		if _, err := strconv.Atoi(limit); err != nil {
			return nil, fmt.Errorf("invalid limit parameter")
		}
		baseQuery += " LIMIT " + limit
	}

	rows, err := db.Query(baseQuery, id)
	return rows, err
}

func GetLastWeightHorse(db *sql.DB, weight *model.Weights, horse *model.Horses,id string) error {
	query := `
			SELECT 
				h.name,
				w1.weight AS weight,
				w2.weight AS LastWeight,
				w1.weight - w2.weight AS DifferenceWeight,
				w1.created_at AS date,
				w2.created_at AS LastDate
			FROM horses AS h
			INNER JOIN weights AS w1 ON h.id = w1.fk_horse_id
			LEFT JOIN weights AS w2 ON w2.fk_horse_id = w1.fk_horse_id 
				AND w2.created_at = (
					SELECT MAX(w3.created_at)
					FROM weights AS w3
					WHERE w3.fk_horse_id = w1.fk_horse_id
						AND w3.created_at < w1.created_at
				)
			WHERE h.id = ?
			ORDER BY w1.created_at DESC 
			LIMIT 1`;

	err := db.QueryRow(query, id).Scan(
				&horse.Name,
				&weight.Weight,
				&weight.LastWeight,
				&weight.DifferenceWeight, 
				&weight.CreatedAt, 
				&weight.LastDate,
			);
	return err;
}
