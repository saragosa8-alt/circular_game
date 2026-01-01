# Game Packs - CSV/Excel Support

This matching game now supports loading custom game packs from CSV and Excel files!

## Supported Formats

- **CSV** (.csv)
- **Excel** (.xlsx, .xls)

## File Format Requirements

Your file must have two columns with the following headers (case-insensitive):

- `term` (or `Term`)
- `definition` (or `Definition`)

### CSV Example

```csv
term,definition
Photosynthesis,Process by which plants convert sunlight into energy
Mitochondria,The powerhouse of the cell that produces ATP
DNA,Genetic material that carries hereditary information
```

### Excel Example

| Term | Definition |
|------|------------|
| Photosynthesis | Process by which plants convert sunlight into energy |
| Mitochondria | The powerhouse of the cell that produces ATP |
| DNA | Genetic material that carries hereditary information |

## How to Use

1. **Click** the "Upload CSV/Excel" button in the settings bar
2. **Select** your CSV or Excel file
3. The game will automatically load your custom pack
4. You'll see a success message showing the pack name and number of pairs loaded
5. A green checkmark (✓) will appear on the upload button to confirm the pack is loaded

## Sample Packs

Two sample game packs are included in this repository:

- `sample_biology_pack.csv` - Biology terms and definitions (10 pairs)
- `sample_chemistry_pack.csv` - Chemistry terms and definitions (10 pairs)

## Features

- **Automatic validation**: Files are checked for required columns
- **Smart filtering**: Empty rows are automatically skipped
- **Case-insensitive headers**: Works with "term"/"Term" and "definition"/"Definition"
- **Toast notifications**: Get instant feedback on upload success or errors
- **Visual confirmation**: Green checkmark appears when a pack is loaded
- **Works with difficulty settings**: Custom packs work with Easy (4 pairs), Medium (5 pairs), and Hard (7 pairs) settings

## Tips

- **Empty rows** are automatically skipped
- **Whitespace** is trimmed from terms and definitions
- The game will show **error messages** if the file format is invalid
- You can **switch between custom and built-in packs** at any time
- Custom packs are **shuffled** just like built-in content
- The **difficulty setting** controls how many pairs are used from your pack

## Error Messages

- **"Invalid file type"** - Make sure your file has a .csv, .xlsx, or .xls extension
- **"Must have term and definition columns"** - Check that your file has columns named "term" and "definition"
- **"No valid term-definition pairs found"** - Your file may be empty or all rows are invalid
- **"CSV/Excel parsing error"** - The file format may be corrupted

## Creating Your Own Packs

1. Create a new CSV or Excel file
2. Add two columns: `term` and `definition`
3. Add your term-definition pairs (as many as you want!)
4. Save the file
5. Upload it to the game using the "Upload CSV/Excel" button

**Tip:** You can create different packs for different subjects (biology, chemistry, history, vocabulary, etc.)

## Technical Details

- **CSV Parser:** PapaParse 5.4.1
- **Excel Parser:** SheetJS (xlsx) 0.18.5
- Files are processed **client-side** (nothing is uploaded to a server)
- The game reads only the **first sheet** in Excel files
- Maximum file size: Limited by browser memory (typically several MB is fine)
- Custom packs override the subject selector - they work with all difficulty levels

## Integration

The CSV/Excel upload feature integrates seamlessly with existing game features:
- ✅ Works with all difficulty levels (Easy, Medium, Hard)
- ✅ Compatible with sound effects and animations
- ✅ Respects the timer and scoring system
- ✅ Data is shuffled to ensure variety
- ✅ Toast notifications for user feedback
