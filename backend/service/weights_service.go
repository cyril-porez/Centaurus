package service

import (
	"back-end-go/interfaces"
	"back-end-go/model"
	"back-end-go/utils"
	"database/sql"
	"time"
)

type Weightservice struct {
	repo interfaces.WeightRepository
}

func NewWeightService(repo interfaces.WeightRepository) *Weightservice {
    return &Weightservice{repo: repo}
}

func (s *Weightservice) AddWeightHorse(db *sql.DB, input *model.WeightInput, horseId int) (model.Weights,[]model.ErrorDetail, error) {
  var details []model.ErrorDetail;
	var result model.Weights

	result.Weight = input.Weight
	result.FkHorseId = horseId
	result.CreatedAt = time.Now().Format(time.RFC3339);

	err := s.repo.AddWeightHorse(db, &result)
	if err != nil {
    utils.AddErrorDetail(&details, "db", "failed to insert weight");
    return result, details, nil;  
  }
  return result, nil, nil;
}


func (s *Weightservice) GetHorseWeights(db *sql.DB, horseId int, limit string, sort string, compare string) (*model.Horses, []model.Weights, *model.Weights, []model.ErrorDetail, error){
  var details []model.ErrorDetail

	// Si compare == true et limit == 1 => on appelle la query spéciale "comparaison"
	if compare == "true" && limit == "1" {
		weight := &model.Weights{}
		horse := &model.Horses{}

		err := s.repo.GetLastWeightHorse(db, horseId, weight, horse)
		if err != nil {
			utils.AddErrorDetail(&details, "query_error", "Error getting last weight comparison")
			return nil, nil, nil, details, err
		}
		return horse, []model.Weights{*weight}, weight, nil, nil
	}

  rows, err := s.repo.GetHorseWeights(db, horseId, limit, sort)
	if err != nil {
		utils.AddErrorDetail(&details, "db_error", "Error querying database")
		return nil, nil, nil, details, err
	}
	defer rows.Close()

	var weights []model.Weights
	var horse model.Horses

	for rows.Next() {
		var weight model.Weights
		if err := rows.Scan(&horse.Name, &weight.CreatedAt, &weight.Weight, &weight.FkHorseId,); err != nil {
			utils.AddErrorDetail(&details, "scan_error", "Error scanning weight row")
			return nil, nil, nil, details, err
		}
		weights = append(weights, weight)
	}

	if err := rows.Err(); err != nil {
		utils.AddErrorDetail(&details, "rows_error", "Error reading rows")
		return nil, nil, nil, details, err
	}

	return &horse, weights, nil, nil, nil
}