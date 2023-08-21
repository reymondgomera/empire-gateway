### GATEWAY API SERVICE

REGISTRATION OF LOCATIONs

- use this route `/empire/registration`
- need bearer token/api key (coming from Portal) and attach to HEADER

### HEADER DETAILS FOR EACH REQUEST

- x-location-code (required)
- x-cpu-id
- x-mac-address
- x-mb-serial
- x-hdd-serial

NOTE:

1. You cannot make request if there is no Location Registration
2. Location Code is required
3. Must include at least (1) machine no. on every request

### AUTHENTICATION

- check if header exist
- check if location and machine details exist
- check if location is whitelisted (if not throw error FORBIDDEN ACCESS)
