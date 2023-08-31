export function getEditorConfig(indentSize: number, maxLine = 120): string {
    return `# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
max_line_length = ${maxLine}
indent_style = space
indent_size = ${indentSize}
`
}
