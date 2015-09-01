# Require any additional compass plugins here.

# You can select your preferred output style here (can be overridden via the command line):
#output_style = :expanded or :nested or :compact or :compressed
output_style = (environment == :production) ? :compressed : :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = (environment == :production) ? false : true

# compile all files relative to this path
project_path = 'client/quickbase/assets'

# put the compiled styles and sprite images into the 'css' folder
generated_images_dir = "css"
css_dir = "css"

sass_dir = ""
images_dir = ""

