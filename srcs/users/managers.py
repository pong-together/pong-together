from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, intra_id, image, **extra_fields):
        if not intra_id:
            raise ValueError('The intra id must be set')
        if not image:
            raise ValueError('The image must be set')

        user = self.model(intra_id=intra_id, image=image, **extra_fields)
        try:
            password = extra_fields['password']
        except KeyError:
            password = intra_id
        user.username = intra_id
        user.set_password(raw_password=password)
        user.save()
        return user

    def create_superuser(self, intra_id, password, **extra_fields):
        image = "http://localhost:8000"
        superuser = self.create_user(intra_id=intra_id, image=image, password=password)

        superuser.is_staff = True
        superuser.is_superuser = True
        superuser.is_active = True

        superuser.save()
        return superuser
