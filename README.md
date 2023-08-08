### GATEWAY API SERVICE

REGISTRATION OF LOCATION

- use this route `/empire/registration`
- need bearer token/api key (coming from Portal) and attach to HEADER

### HEADER REQUEST FOR EACH REQUEST

NOTE:
You cannot make request if there is no Location Registration
Location Code is required
Must include at least (1) machine no. on each every request

- x-location-code (required)
- x-cpu-id
- x-mac-address
- x-mb-serial
- x-hdd-serial

### AUTHENTICATION

- check if header exist
- check if location and machine details exist
- check if location is whitelisted (if not throw error FORBIDDEN ACCESS)
