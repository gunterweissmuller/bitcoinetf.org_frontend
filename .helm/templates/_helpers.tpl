
{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "dev-env.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "kube-namespace" -}}
{{- printf "%s-%s" .Values.git.tag .Values.git.name | lower | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "ingressDomain" -}}
{{- printf "%s.%s.%s" .Values.git.tag .Values.git.name .Values.devDomain | lower | trunc 255 | trimSuffix "-" -}}
{{- end -}}

{{- define "imagePullSecret" }}
{{- printf "{\"auths\": {\"%s\": {\"auth\": \"%s\"}}}" .Values.imageCred.registry (printf "%s:%s" .Values.imageCred.username .Values.imageCred.password | b64enc) | b64enc }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "dev-env.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "dev-env.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "apps-env-var-values" -}}
{{- $globals := ternary .Values.global.stage (ternary .Values.global.prod .Values.global.dev (eq .Values.global.env_name "prod")) (eq .Values.global.env_name "stage") -}}
- name: APP_NAME
  value: "{{ upper .Values.global.app_name }}"
- name: APP_ENV
  value: "{{ .Values.global.env_full_name }}"
- name: SITE_URL
  value: "https://{{ .Values.global.ci_url }}{{- if and (ne .Values.global.ci_path "") (ne .Values.global.ci_path "/") }}/{{ .Values.global.ci_path | trimAll "/" }}{{- else }}/{{- end }}"
- name: NUXT_PUBLIC_WEBSOCKET_URL
  value: "{{ $globals.NuxtWsUrl }}"
- name: NUXT_PUBLIC_WEBSOCKET_TOKEN
  value: "{{ $globals.NuxtWsToken }}"
- name: NUXT_PUBLIC_INFO_API
  value: "{{ $globals.NuxtInfoApi }}"
- name: NUXT_PUBLIC_ETH_API
  value: "{{ $globals.NuxtEthApi }}"
- name: NUXT_PUBLIC_EXPLORER_API
  value: "{{ $globals.NuxtExplorerApi }}"
- name: NUXT_PUBLIC_ICON_API
  value: "{{ $globals.NuxtIconsApi }}"
- name: DOMAIN
  value: "https://{{ .Values.global.ci_url }}{{- if and (ne .Values.global.ci_path "") (ne .Values.global.ci_path "/") }}/{{ .Values.global.ci_path | trimAll "/" }}{{- else }}/{{- end }}"
- name: APP_DOMAIN
  value: "https://{{ .Values.global.app_url }}{{- if and (ne .Values.global.ci_path "") (ne .Values.global.ci_path "/") }}/{{ .Values.global.ci_path | trimAll "/" }}{{- else }}/{{- end }}"
{{- end -}}
