A web3 application that enables users to comment on their own NFTs

# Setup
`git clone https://github.com/gizmotronn/comments`

`yarn`
`yarn dev`

## Handling database migrations
Whenever the `...original-ddl.sql` migration is updated, make sure to update the database types by running the following command:
```bash
npx supabase gen types typescript --local > src/database.types.ts
```

# Future releases
* Integration with Moralis
* Integration with [gizmotronn/mint](https://github.com/gizmotronn/mint)

# Collaborators
Members of [Signal Kinetics](https://githu.com/signal-k) can access the [documentation](https://github.com/Gizmotronn/comments/settings/secrets/actions)

[Email me](mailto:liam@skinetics.tech) to find out more about Signal Kinetics