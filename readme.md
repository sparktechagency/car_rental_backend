# Car-Rental

### To do

1. Include max distance on car search
2. Include approved car on car search
3. how much surcharge?
4. what about deposit and refund?
5. secure payment routes
6. put only approved cars on main search

#

above is my data model of car and trip. I want to build an advance search, filter system like the one in turo.com. with the below fields.

    latitude
    longitude
    fromDate
    fromTime
    toDate
    toTime

    minPrice: 45,
    maxPrice: 85,
    vehicleType: car,
    make: Audi,
    year: 2017,
    model: X5,
    seats: 6,
    isElectric: true,

fromDate & fromTime will be converted to tripStartDateTime (2024-10-31T09:44:33.436+00:00) time format when saving to mongodb
toDate & toTime will be converted to tripEndDateTime (2024-10-31T09:44:33.436+00:00) time format when saving to mongodb

pricePerDay will be withing minPrice and maxPrice.
seats will be greater than or equal.

I want to search in the trip collection if a car has a trip within the tripStartDateTime, tripEndDateTime time range. exclude all of these cars. and show the remaining cars from the car collection.

build me the logic. make it developer friendly

# Cities

London
Birmingham
Manchester
Liverpool
Leeds
Sheffield
Bristol
Newcastle upon Tyne
Sunderland
Nottingham
Leicester
Southampton
Portsmouth
Wolverhampton
Derby
Stoke-on-Trent
Coventry
Bradford
Hull (Kingston upon Hull)
York
Middlesbrough
Oxford
Cambridge
Plymouth
Exeter
Brighton
Hove
Reading
Bournemouth
Swindon
Northampton
Ipswich
Gloucester
Norwich
Milton Keynes
Warrington
Chester
Luton
Blackburn
Bolton
Telford
Blackpool
Southend-on-Sea
Basildon
Colchester
Slough
Watford
Oldham
Stockport
Rotherham
Wigan
Rochdale
Huddersfield
Sutton Coldfield
Eastbourne
Worthing
Crawley
Basingstoke
Birkenhead
Dudley
Redditch
Stevenage
Maidstone
Gillingham
Braintree
Wakefield
Doncaster
Barnsley
Gateshead
Solihull
Scunthorpe
Darlington
Chelmsford
Aylesbury
Hemel Hempstead
Burnley
