docker compose up boilerplate -d
result=$(docker compose exec boilerplate yarn migration:generate test 2>/dev/null)
if [[ $result != *"No changes in database schema were found"* ]];
then 
  echo "Migrations pending: $result" >&2 
  exit 1 
fi