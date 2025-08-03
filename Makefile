.PHONY: determine-app-version
determine-app-version:
	ruby script/determine_app_version.rb

.PHONY: generate-changelog
generate-changelog:
	ruby script/generate_changelog.rb