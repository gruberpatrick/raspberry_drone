echo "---------------------------------------------------"
echo " Tie your drone down, otherwise you might loose it!"
echo "---------------------------------------------------"

read nothing

pigs s $1 1000 # minimum throttle
sleep 1
pigs s $1 2000 # maximum throttle
sleep 1
pigs s $1 1200 # slightly open throttle
sleep 1
pigs s $1 1300 # open throttle even more
