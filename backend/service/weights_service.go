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

func GetLastWeightHorse(db *sql.DB, weight *model.Weights, horse *model.Horses,id string) ([]utils.ErrorDetail, error) {
  var details []utils.ErrorDetail;

  if err := repository.GetLastWeightHorse(db, weight, horse, id); err != nil {
    utils.AddErrorDetail(&details,"test", "test");
    return details, nil;
  }
  return nil, nil
}

func GetLastSixWeightsHorse(db *sql.DB, id string) (*model.Horses, []model.Weights, []utils.ErrorDetail, error) {
  var details []utils.ErrorDetail
	rows, err := repository.GetLastSixWeightsHorse(db, id);
	if err != nil {
		utils.AddErrorDetail(&details, "test", "test");
		return  nil, nil, details, err;
	}

  defer rows.Close();

  var weights []model.Weights
  var horse model.Horses;

  for rows.Next() {
    var weight model.Weights;
    
    if err = rows.Scan(&horse.Name, &weight.Date, &weight.Weight); err != nil {
      utils.AddErrorDetail(&details, "repsitory error", "Error lors de la récupération des données");
			return nil, nil, details, err;
    }
    weights = append(weights, weight);
  }

  if err := rows.Err(); err != nil {
    utils.AddErrorDetail(&details, "repsitory error", "Error lors de la résultats");
    return nil, nil, details, err;
  }

  return &horse, weights, details, nil
}

func GetWeightsHorse(db *sql.DB, id string) (*model.Horses, []model.Weights, []utils.ErrorDetail, error) {
  var details []utils.ErrorDetail
	rows, err := repository.GetWeightsHorse(db, id);
	if err != nil {
		utils.AddErrorDetail(&details, "test", "test");
		return  nil, nil, details, err;
	}

  defer rows.Close();

  var weights []model.Weights
  var horse model.Horses;

  for rows.Next() {
    var weight model.Weights;
    
    if err = rows.Scan(&horse.Name, &weight.Date, &weight.Weight); err != nil {
      utils.AddErrorDetail(&details, "repsitory error", "Error lors de la récupération des données");
			return nil, nil, details, err;
    }
    weights = append(weights, weight);
  }

  if err := rows.Err(); err != nil {
    utils.AddErrorDetail(&details, "repsitory error", "Error lors de la résultats");
    return nil, nil, details, err;
  }

  return &horse, weights, details, nil
}