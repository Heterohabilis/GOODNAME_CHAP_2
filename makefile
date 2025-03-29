github:
	-git commit -a
	git push origin main

all_tests:
	npx jest --silent
