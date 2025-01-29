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

func GetLastWeightHorse(db *sql.DB, weight *model.Weights, id string) ([]utils.ErrorDetail, error) {
  var details []utils.ErrorDetail;

  if err := repository.GetLastWeightHorse(db, weight, id); err != nil {
    utils.AddErrorDetail(&details,"test", "test");
    return details, nil;
  }
  return nil, nil
}