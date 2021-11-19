#!/bin/sh

set -e

ME=$(basename $0)

render_template() {
  local template_dir="/opt/src"
  local suffix=""
  local output_dir="/opt/dst"

  local template defined_envs relative_path output_path subdir
  defined_envs=$(printf '${%s} ' $(env | cut -d= -f1))
  [ -d "$template_dir" ] || return 0
  if [ ! -w "$output_dir" ]; then
    echo >&3 "$ME: ERROR: $template_dir exists, but $output_dir is not writable"
    return 0
  fi

  for f in $(find $template_dir -type f); do
    relative_path="${f#$template_dir/}"
    output_path="$output_dir/${relative_path}"
    subdir=$(dirname "$relative_path")
    # create a subdirectory where the template file exists
    mkdir -p "$output_dir/$subdir"
    echo >&3 "$ME: Running envsubst on $f to $output_path"
    envsubst "$defined_envs" < $f > "$output_path";
  done
}

render_template

exit 0