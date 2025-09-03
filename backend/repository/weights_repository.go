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

func (r *SQLWeightRepository) GetLastWeightHorse(db *sql.DB, horseId int, weight *model.Weights, horse *model.Horses) error {
  // R�cup�rer le nom (m�me s�il n�y a aucun poids)
    if err := db.QueryRow(`SELECT name FROM horses WHERE id = ?`, horseId).
        Scan(&horse.Name); err != nil {
        return fmt.Errorf("horse not found: %w", err)
    }

    // 1) Compter les lignes
    var cnt int
    if err := db.QueryRow(
        `SELECT COUNT(*) FROM weights WHERE fk_horse_id = ?`,
        horseId,
    ).Scan(&cnt); err != nil {
        return fmt.Errorf("count weights: %w", err)
    }

    switch {
    case cnt == 0:
        // Aucun poids en BDD
        weight.Weight           = 0
        weight.LastWeight       = 0        // ou intPtr(0) si tu pr�f�res
        weight.DifferenceWeight = 0
        weight.CreatedAt        = time.Time{}  // ou time.Now()
        weight.LastDate         = ""
        weight.FkHorseId        = horseId
        return nil

    case cnt == 1:
        // Un seul poids ? pas de comparaison possible
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

        weight.Weight           = w
        weight.LastWeight       = nil          // ou intPtr(0) si tu veux 0 au lieu de null
        weight.DifferenceWeight = w            // diff�rence = w - 0
        weight.CreatedAt        = created
        weight.LastDate         = ""
        weight.FkHorseId        = horseId
        return nil

    default:
        // = 2 poids ? requ�te compl�te
        const q = `
            SELECT 
                w1.weight,
                COALESCE(w2.weight, 0)                             AS LastWeight,
                (w1.weight - COALESCE(w2.weight, 0))               AS DifferenceWeight,
                w1.created_at                                      AS CreatedAt,
                w2.created_at                                      AS LastDate,
                w1.fk_horse_id
            FROM weights AS w1
            LEFT JOIN weights AS w2
              ON w2.fk_horse_id = w1.fk_horse_id
             AND w2.created_at = (
                    SELECT MAX(w3.created_at)
                    FROM weights AS w3
                    WHERE w3.fk_horse_id = w1.fk_horse_id
                      AND w3.created_at < w1.created_at
                )
            WHERE w1.fk_horse_id = ?
            ORDER BY w1.created_at DESC
            LIMIT 1;
        `
        var (
            w, lw, dw, fk int
            created       time.Time
            lastDate      sql.NullTime
        )
        if err := db.QueryRow(q, horseId).Scan(
            &w, &lw, &dw, &created, &lastDate, &fk,
        ); err != nil {
            return fmt.Errorf("query weights diff: %w", err)
        }

        weight.Weight           = w
        weight.LastWeight       = lw
        weight.DifferenceWeight = dw
        weight.CreatedAt        = created
        weight.FkHorseId        = fk
        if lastDate.Valid {
            weight.LastDate = lastDate.Time.Format(time.RFC3339)
        } else {
            weight.LastDate = ""
        }
        return nil
    }
}
