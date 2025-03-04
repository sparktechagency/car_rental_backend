# Car-Rental

# Database Design

[Database Design](https://miro.com/welcomeonboard/NSt2cERWeTZPeU5NKzZPeEI3YXM2QzlNN2Y5RmM0eWh1dzlWanBrZE9DZDJnOENxWWVpTjY2Y0w2Y1I1SWMrNkFkZXp0OEd2TmI0TEFKa0tFSlZqNXZhb3RCck9HTUtFSFRwdXkyVkxtQWRPaVdGMTd2VzZCdTZKWHNWRDhyZDJBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=675653189373)

### To do

1. connect stripe with clients stripe change credentials of mail, mongodb
2. check payments with dashboard
3. re-deploy after test
4. check your spam box
5. 0 instead 
6. check your junk mail popup
7. nardo logo on first host 

# gpt cmd

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
