library(datasets)
library(jsonlite)

setwd('/Users/jasonshu/Dropbox/1) Data Viz/HW2')
s <- state.x77
head(s)

df <- data.frame(
  state.name,
  state.abb,
  state.x77,
  state.region,
  state.division,
  row.names = NULL
)

head(df)

names <- c('state', 'abbr', 'pop', 'income', 'illiteracy', 'lifeExp', 'murder', 'grad', 'frost', 'area', 'region', 'division')
colnames(df) <- names

# json <- toJSON(
#   df,
#   dataframe = "rows",
#   factor = "string",
#   pretty = TRUE
# )
# cat(json, file = "state.x77.json")

write.csv(df, 'stateData.csv')
