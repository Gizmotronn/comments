create extension if not exists moddatetime schema extensions;
create triger handle_updated_at before update on comments;
    for each row execute procedure moddatetime (updated_at);
/* Set `updated_at` column to current timestamp for every [comment] update */