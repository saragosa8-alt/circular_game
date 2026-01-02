-- Seed initial data for testing

-- Insert Biology module
INSERT INTO modules (id, name, description)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Biology', 'Biological sciences and life studies')
ON CONFLICT (name) DO NOTHING;

-- Insert Cell Structures game pack
INSERT INTO game_packs (id, module_id, name, description, difficulty)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Cell Structures', 'Learn about cellular biology', 'medium')
ON CONFLICT (module_id, name) DO NOTHING;

-- Insert questions (using exact terms from the original game's Science pack)
INSERT INTO questions (pack_id, term, definition, order_index)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Photosynthesis', 'Process by which plants convert sunlight into energy', 1),
  ('b0000000-0000-0000-0000-000000000001', 'Mitochondria', 'The powerhouse of the cell that produces ATP', 2),
  ('b0000000-0000-0000-0000-000000000001', 'DNA', 'Genetic material that carries hereditary information', 3),
  ('b0000000-0000-0000-0000-000000000001', 'Ecosystem', 'A community of living organisms and their environment', 4),
  ('b0000000-0000-0000-0000-000000000001', 'Homeostasis', 'The ability to maintain stable internal conditions', 5),
  ('b0000000-0000-0000-0000-000000000001', 'Evolution', 'Change in species over generations through natural selection', 6),
  ('b0000000-0000-0000-0000-000000000001', 'Atom', 'The smallest unit of matter that retains element properties', 7),
  ('b0000000-0000-0000-0000-000000000001', 'Gravity', 'Force that attracts objects with mass toward each other', 8)
ON CONFLICT DO NOTHING;
