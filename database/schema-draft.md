# Database Schema Draft

## Main Tables

### users
- id
- name
- email
- role
- created_at

### locations
- id
- name
- city
- latitude
- longitude
- description
- category_id

### stories
- id
- location_id
- title
- original_content
- simplified_story
- source
- status

### media
- id
- location_id
- type
- url
- description

### contributions
- id
- user_id
- location_id
- content
- media_url
- status
- submitted_at

### categories
- id
- name
- description
