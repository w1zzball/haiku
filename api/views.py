from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
import json
from static.helpers.haiku_helpers import format_haiku, is_haiku


@method_decorator(csrf_protect, name='dispatch')
@require_http_methods(["POST"])
def validate_haiku(request):
    data = json.loads(request.body)
    text = data.get('text', '')

    formatted = format_haiku(text)

    return JsonResponse({
        'valid': bool(formatted),
        'formatted': formatted if formatted else None,
        'error': None if formatted else 'Text must follow the 5-7-5 syllable pattern of a haiku.'
    })
