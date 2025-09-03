package repository

import (
	"back-end-go/model"
	"database/sql"
	"fmt"
	"strconv"
  "time"
)

type SQLWeightRepository struct {}

func (r *SQLWeightRepository) AddWeightHorse(db *sql.DB, weight *model.Weights) error {	
	query := "INSERT INTO weights (weight, fk_horse_id) VALUES (?, ?)"
	_, err := db.Exec(query, weight.Weight, weight.FkHorseId)
	return err
}

func (r *SQLWeightRepository) GetHorseWeights(db *sql.DB, horseId int, limit string, sort string) (*sql.Rows, error) {
	baseQuery := `
		SELECT 
			h.name, 
			w.created_at, 
			w.weight,
			w.fk_horse_id
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

	rows, err := db.Query(baseQuery, horseId)
	return rows, err
}

func intPtr(v int) *int {
	p := new(int)
	*p = v
	return p
}

func ts(t time.Time) string {
	// Choisis le format qui te convient (RFC3339 est passe-partout)
	return t.Format(time.RFC3339)
}

func (r *SQLWeightRepository) GetLastWeightHorse(db *sql.DB, horseId int, weight *model.Weights, horse *model.Horses) error {
  // 1) Nom du cheval
	if err := db.QueryRow(`SELECT name FROM horses WHERE id = ?`, horseId).Scan(&horse.Name); err != nil {
		return fmt.Errorf("horse not found: %w", err)
	}

	// 2) Nombre de mesures de poids
	var cnt int
	if err := db.QueryRow(`SELECT COUNT(*) FROM weights WHERE fk_horse_id = ?`, horseId).Scan(&cnt); err != nil {
		return fmt.Errorf("count weights: %w", err)
	}

	switch {
	case cnt == 0:
		// Aucun poids ? tout vide / z�ro. Les *int restent nil.
		weight.Weight = 0
		weight.LastWeight = nil
		weight.DifferenceWeight = nil
		weight.CreatedAt = "" // string dans ton mod�le
		weight.LastDate = ""
		weight.FkHorseId = horseId
		return nil

	case cnt == 1:
		// Un seul poids ? diff = w - 0, pas de lastWeight.
		var w int
		var created time.Time
		if err := db.QueryRow(
			`SELECT weight, created_at
			   FROM weights
			  WHERE fk_horse_id = ?
			  ORDER BY created_at DESC
			  LIMIT 1`,
			horseId,
		).Scan(&w, &created); err != nil {
			return fmt.Errorf("get single weight: %w", err)
		}

		weight.Weight = w
		weight.LastWeight = nil
		weight.DifferenceWeight = intPtr(w) // w - 0
		weight.CreatedAt = ts(created)
		weight.LastDate = ""
		weight.FkHorseId = horseId
		return nil

	default:
		// = 2 poids ? dernier + pr�c�dent
		const q = `
			SELECT 
				w1.weight          AS cur_w,
				w1.created_at      AS cur_dt,
				w2.weight          AS prev_w,
				w2.created_at      AS prev_dt
			FROM weights AS w1
			LEFT JOIN weights AS w2
			  ON w2.fk_horse_id = w1.fk_horse_id
			 AND w2.created_at = (
					SELECT MAX(w3.created_at)
					  FROM weights w3
					 WHERE w3.fk_horse_id = w1.fk_horse_id
					   AND w3.created_at < w1.created_at
			  )
			WHERE w1.fk_horse_id = ?
			ORDER BY w1.created_at DESC
			LIMIT 1;
		`

		var (
			curW      int
			curDT     time.Time
			prevWNull sql.NullInt64
			prevDT    sql.NullTime
		)

		if err := db.QueryRow(q, horseId).Scan(&curW, &curDT, &prevWNull, &prevDT); err != nil {
			return fmt.Errorf("query last+previous: %w", err)
		}

		// Pointeurs d�int pour le mod�le
		var lastWeightPtr *int
		var diffPtr *int
		if prevWNull.Valid {
			last := int(prevWNull.Int64)
			diff := curW - last
			lastWeightPtr = intPtr(last)
			diffPtr = intPtr(diff)
		} else {
			// Par s�curit� (devrait pas arriver avec cnt>=2)
			diffPtr = intPtr(curW)
			lastWeightPtr = nil
		}

		weight.Weight = curW
		weight.LastWeight = lastWeightPtr
		weight.DifferenceWeight = diffPtr
		weight.CreatedAt = ts(curDT)
		if prevDT.Valid {
			weight.LastDate = ts(prevDT.Time)
		} else {
			weight.LastDate = ""
		}
		weight.FkHorseId = horseId
		return nil
	}
}
