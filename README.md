# backend
## 커밋 컨벤션

```jsx
feat/pong-together/backend#1: login 구현
```

`merge`: 풀리퀘스트 합병에 대한 커밋  
`feat` : 새로운 기능에 대한 커밋  
`fix` : 버그 수정에 대한 커밋  
`build` : 빌드 관련 파일 수정에 대한 커밋  
`chore` : 그 외 자잘한 수정에 대한 커밋  
`docs` : 문서 수정에 대한 커밋  
`refactor` : 코드 리팩토링에 대한 커밋  
`test` : 테스트 코드 수정에 대한 커밋  
`design` : 사용자 UI 디자인의 변경에 대한 커밋

## 깃이슈 사용

- 자신이 담당하는 큰 이슈 하나 생성
    - 작은 작업단위, 문제가 생길 때마다 하위 이슈 생성
- 한 이슈를 팔때마다 반드시 브랜치를 생성해서 작업하기
    
    ```jsx
    feature/login
    ```
    

<aside>
💡 타입을 기반으로 한 접두어 사용

- **`feature/`** - 새로운 기능을 개발하는 브랜치
- **`bugfix/`** - 버그를 수정하는 브랜치
- **`hotfix/`** - 프로덕션에서 긴급하게 수정해야 하는 버그에 대한 브랜치
- **`release/`** - 릴리스 준비를 위한 브랜치
- **`task/`** - 특정 작업을 수행하는 브랜치
- **`refactor/`** - 코드 구조를 개선하는 데 중점을 둔 브랜치
</aside>

<aside>
💡 깃 컨벤션은 프론트와 동일

</aside>

## 패키지 관리

1. `pip freeze **>** requirements.txt`
    - 새로운 패키지 저장시 이 명령어를 사용해서 requirements.txt 업데이트 해줘야함
1. `pip install -r requirements.txt`
    - 모든 패키지 한꺼번에 저장 가능, 팀원이 새로운 패키지를 다운 받아서 프로젝트 제작후 머지한걸 받으면 나도 이 명령어 써서 그 패키지들 한꺼번에 받을 수 있음

## 코딩 컨벤션

- 들여쓰기 2번까지는 허용
    - 2번의 경우도 반복문 안의 조건문 정도만 허용

### App

- 앱 이름은 복수 명사로.

### View

- Class Based View 만 사용

### Naming Convention

- 모듈 이름은 모두 소문자
    - 가독성을 위한 _ (under bar) 허용
- 클래스명은 CamelCase
    - 내부적으로 쓰이면 밑줄을 앞에 붙임
    - 에러 예외인 경우 Error을 앞에 붙임
- 함수명은 소문자로 구성
    - 필요시 밑줄로 나눔
- 인스턴스 메소드의 첫번째 인자는 언제나 `self`
- 메소드명은 함수명과 같으나, 
private 메소드 혹은 변수는 밑줄을 앞에 붙임
- 상수는 모듈 단위에서만 정의
    - 모두 대문자. 필요하면 밑줄