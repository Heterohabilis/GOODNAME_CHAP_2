github:
	-git commit -a
	git push origin main

all_test:
	npx jest --silent
