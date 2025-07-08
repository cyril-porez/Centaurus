package service

import (
	"back-end-go/model"
	"back-end-go/repository"
	"back-end-go/utils"
	"database/sql"
)

func AddWeightHorse(db *sql.DB, weight *model.Weights, id string) ([]utils.ErrorDetail, error) {
  var details []utils.ErrorDetail;

  if err := repository.AddWeightHorse(db, weight, id); err != nil {
    utils.AddErrorDetail(&details,"test", "test");
    return details, nil;  
  }
  return nil, nil;
}


func GetHorseWeights(db *sql.DB, id string, limit string, sort string, compare string) (*model.Horses, []model.Weights, *model.Weights, []utils.ErrorDetail, error){
  var details []utils.ErrorDetail

	// Si compare == true et limit == 1 => on appelle la query spéciale "comparaison"
	if compare == "true" && limit == "1" {
		weight := &model.Weights{}
		horse := &model.Horses{}

		if err := repository.GetLastWeightHorse(db, weight, horse, id); err != nil {
			utils.AddErrorDetail(&details, "query_error", "Error getting last weight with comparison")
			return nil, nil, nil, details, err
		}

		// On renvoie un seul poids dans le tableau (pour cohérence)
		weights := []model.Weights{*weight}
		return horse, weights, weight, nil, nil
	}
  // Sinon, on prend la liste classique
	rows, err := repository.GetHorseWeights(db, id, limit, sort)
	if err != nil {
		utils.AddErrorDetail(&details, "db_error", "Error querying database")
		return nil, nil, nil, details, err
	}
	defer rows.Close()

	var weights []model.Weights
	var horse model.Horses

	for rows.Next() {
		var weight model.Weights
		if err = rows.Scan(&horse.Name, &weight.CreatedAt, &weight.Weight); err != nil {
			utils.AddErrorDetail(&details, "scan_error", "Error scanning data")
			return nil, nil, nil, details, err
		}
		weights = append(weights, weight)
	}

	if err = rows.Err(); err != nil {
		utils.AddErrorDetail(&details, "rows_error", "Error reading rows")
		return nil, nil, nil, details, err
	}

	return &horse, weights, nil, nil, nil
}