### GATEWAY API SERVICE

REGISTRATION OF LOCATION

- use this route `/empire/registration`
- need bearer token/api key (coming from Portal) and attach to HEADER

### HEADER REQUEST FOR EACH REQUEST

NOTE: YOU CANNOT MAKE REQUEST IF THERE IS NO REGISTRATION

- x-location-code
- x-cpu-id
- x-mac-address
- x-mb-serial
- x-hdd-serial

### AUTHENTICATION

- check if header exist
- check if location and machine details exist
- check if location is whitelisted (if not throw error FORBIDDEN ACCESS)
